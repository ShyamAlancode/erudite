// Firestore Service
// Handles all database operations for user data, learning state, and analytics

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Save or update user's learning state
 * @param {string} userId - The user's Firebase UID
 * @param {Object} learningState - Learning state data
 */
export async function saveLearningState(userId, learningState) {
    try {
        const docRef = doc(db, 'learningStates', userId);
        await setDoc(docRef, {
            ...learningState,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving learning state:', error);
        throw error;
    }
}

/**
 * Get user's learning state
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Object>} - Learning state data
 */
export async function getLearningState(userId) {
    try {
        const docRef = doc(db, 'learningStates', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }

        // Return default learning state if none exists
        return {
            misconceptions: [],
            weakConcepts: [],
            masteredConcepts: [],
            totalQuestions: 0,
            correctAnswers: 0,
            studySessions: 0,
            totalStudyTime: 0
        };
    } catch (error) {
        console.error('Error getting learning state:', error);
        throw error;
    }
}

/**
 * Add a misconception to user's learning history
 * @param {string} userId - The user's Firebase UID
 * @param {string} concept - The misconception concept
 * @param {string} correction - The correct understanding
 */
export async function addMisconception(userId, concept, correction) {
    try {
        const docRef = doc(db, 'learningStates', userId);
        await updateDoc(docRef, {
            misconceptions: arrayUnion({
                concept,
                correction,
                timestamp: new Date().toISOString()
            }),
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error adding misconception:', error);
        // If document doesn't exist, create it
        await saveLearningState(userId, {
            misconceptions: [{
                concept,
                correction,
                timestamp: new Date().toISOString()
            }],
            weakConcepts: [],
            masteredConcepts: [],
            totalQuestions: 0,
            correctAnswers: 0,
            studySessions: 0,
            totalStudyTime: 0
        });
        return true;
    }
}

/**
 * Save a chat session to history
 * @param {string} userId - The user's Firebase UID
 * @param {Array} messages - Array of message objects
 * @param {string} documentTitle - Title of the PDF being studied
 */
export async function saveChatSession(userId, messages, documentTitle) {
    try {
        const sessionsRef = collection(db, 'chatSessions');
        await addDoc(sessionsRef, {
            userId,
            messages,
            documentTitle,
            createdAt: serverTimestamp(),
            messageCount: messages.length
        });
        return true;
    } catch (error) {
        console.error('Error saving chat session:', error);
        throw error;
    }
}

/**
 * Get user's chat history
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Array>} - Array of chat sessions
 */
export async function getChatHistory(userId) {
    try {
        const sessionsRef = collection(db, 'chatSessions');
        const q = query(
            sessionsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting chat history:', error);
        return [];
    }
}

/**
 * Log a study session for analytics
 * @param {string} userId - The user's Firebase UID
 * @param {number} duration - Session duration in minutes
 * @param {string} topic - Topic studied
 */
export async function logStudySession(userId, duration, topic) {
    try {
        const sessionsRef = collection(db, 'studySessions');
        await addDoc(sessionsRef, {
            userId,
            duration,
            topic,
            date: serverTimestamp()
        });

        // Also update total stats
        const stateRef = doc(db, 'learningStates', userId);
        const stateDoc = await getDoc(stateRef);

        if (stateDoc.exists()) {
            const data = stateDoc.data();
            await updateDoc(stateRef, {
                studySessions: (data.studySessions || 0) + 1,
                totalStudyTime: (data.totalStudyTime || 0) + duration,
                updatedAt: serverTimestamp()
            });
        }

        return true;
    } catch (error) {
        console.error('Error logging study session:', error);
        throw error;
    }
}

/**
 * Get weekly study analytics
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Array>} - Daily study time for the past week
 */
export async function getWeeklyAnalytics(userId) {
    try {
        const sessionsRef = collection(db, 'studySessions');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const q = query(
            sessionsRef,
            where('userId', '==', userId),
            where('date', '>=', oneWeekAgo),
            orderBy('date', 'asc')
        );

        const querySnapshot = await getDocs(q);

        // Group by day
        const dailyData = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize all days with 0
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];
            dailyData[dayName] = 0;
        }

        // Sum up study time per day
        querySnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.date) {
                const date = data.date.toDate();
                const dayName = days[date.getDay()];
                dailyData[dayName] = (dailyData[dayName] || 0) + (data.duration || 0);
            }
        });

        return Object.entries(dailyData).map(([day, minutes]) => ({
            day,
            minutes
        }));
    } catch (error) {
        console.error('Error getting weekly analytics:', error);
        // Return empty data
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
            day,
            minutes: 0
        }));
    }
}

/**
 * Save simulated marks/rank data for what-if analysis
 * @param {string} userId - The user's Firebase UID
 * @param {Object} data - Marks and rank data
 */
export async function saveMarksData(userId, data) {
    try {
        const docRef = doc(db, 'marksAnalysis', userId);
        await setDoc(docRef, {
            ...data,
            isSimulated: true, // Always mark as simulated
            updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving marks data:', error);
        throw error;
    }
}

/**
 * Get marks/rank data
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Object>}
 */
export async function getMarksData(userId) {
    try {
        const docRef = doc(db, 'marksAnalysis', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }

        return {
            marks: [],
            isSimulated: true
        };
    } catch (error) {
        console.error('Error getting marks data:', error);
        return { marks: [], isSimulated: true };
    }
}
