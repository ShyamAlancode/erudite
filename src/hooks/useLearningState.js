// useLearningState Hook
// Manages persistent learning state with Firestore

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getLearningState,
    saveLearningState,
    addMisconception,
    getWeeklyAnalytics,
    logStudySession
} from '../services/firestoreService';

/**
 * Custom hook for learning state management
 * @returns {Object} Learning state and methods
 */
export function useLearningState() {
    const { user } = useAuth();
    const [learningState, setLearningState] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load learning state when user changes
    useEffect(() => {
        async function loadState() {
            if (!user) {
                setLearningState(null);
                setIsLoading(false);
                return;
            }

            try {
                const state = await getLearningState(user.uid);
                setLearningState(state);

                const stats = await getWeeklyAnalytics(user.uid);
                setWeeklyStats(stats);
            } catch (error) {
                console.error('Error loading learning state:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadState();
    }, [user]);

    /**
     * Record a misconception
     * @param {string} concept - The misconceived concept
     * @param {string} correction - The correct understanding
     */
    const recordMisconception = useCallback(async (concept, correction) => {
        if (!user) return;

        try {
            await addMisconception(user.uid, concept, correction);
            // Update local state
            setLearningState(prev => ({
                ...prev,
                misconceptions: [
                    ...(prev?.misconceptions || []),
                    { concept, correction, timestamp: new Date().toISOString() }
                ]
            }));
        } catch (error) {
            console.error('Error recording misconception:', error);
        }
    }, [user]);

    /**
     * Update weak concepts list
     * @param {string} concept - Concept to add to weak list
     */
    const addWeakConcept = useCallback(async (concept) => {
        if (!user || !learningState) return;

        const updatedWeakConcepts = [...(learningState.weakConcepts || [])];
        if (!updatedWeakConcepts.includes(concept)) {
            updatedWeakConcepts.push(concept);

            try {
                await saveLearningState(user.uid, {
                    ...learningState,
                    weakConcepts: updatedWeakConcepts
                });
                setLearningState(prev => ({
                    ...prev,
                    weakConcepts: updatedWeakConcepts
                }));
            } catch (error) {
                console.error('Error adding weak concept:', error);
            }
        }
    }, [user, learningState]);

    /**
     * Mark a concept as mastered
     * @param {string} concept - Concept to mark as mastered
     */
    const markConceptMastered = useCallback(async (concept) => {
        if (!user || !learningState) return;

        const updatedMastered = [...(learningState.masteredConcepts || [])];
        const updatedWeak = (learningState.weakConcepts || []).filter(c => c !== concept);

        if (!updatedMastered.includes(concept)) {
            updatedMastered.push(concept);

            try {
                await saveLearningState(user.uid, {
                    ...learningState,
                    masteredConcepts: updatedMastered,
                    weakConcepts: updatedWeak
                });
                setLearningState(prev => ({
                    ...prev,
                    masteredConcepts: updatedMastered,
                    weakConcepts: updatedWeak
                }));
            } catch (error) {
                console.error('Error marking concept mastered:', error);
            }
        }
    }, [user, learningState]);

    /**
     * Log a study session
     * @param {number} duration - Duration in minutes
     * @param {string} topic - Topic studied
     */
    const recordStudySession = useCallback(async (duration, topic) => {
        if (!user) return;

        try {
            await logStudySession(user.uid, duration, topic);
            // Refresh weekly stats
            const stats = await getWeeklyAnalytics(user.uid);
            setWeeklyStats(stats);
        } catch (error) {
            console.error('Error logging study session:', error);
        }
    }, [user]);

    /**
     * Get learning state as JSON string for Gemini context
     */
    const getLearningStateContext = useCallback(() => {
        if (!learningState) return '';

        return JSON.stringify({
            weakConcepts: learningState.weakConcepts || [],
            recentMisconceptions: (learningState.misconceptions || []).slice(-5),
            masteredConcepts: learningState.masteredConcepts || []
        });
    }, [learningState]);

    return {
        learningState,
        weeklyStats,
        isLoading,
        recordMisconception,
        addWeakConcept,
        markConceptMastered,
        recordStudySession,
        getLearningStateContext
    };
}

export default useLearningState;
