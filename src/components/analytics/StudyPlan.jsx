// Study Plan Component
// Generates personalized study plans based on PDF and weak concepts

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { usePDF } from '../../context/PDFContext';
import { useLearningState } from '../../hooks/useLearningState';
import { generateStudyPlan, generateRevisionSheet } from '../../config/gemini';
import { Button } from '../ui/Button';

export function StudyPlan() {
    const { pdfContent, hasPDF } = usePDF();
    const { learningState } = useLearningState();
    const [studyPlan, setStudyPlan] = useState('');
    const [revisionSheet, setRevisionSheet] = useState('');
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);
    const [isLoadingSheet, setIsLoadingSheet] = useState(false);
    const [activeTab, setActiveTab] = useState('plan');

    async function handleGeneratePlan() {
        if (!pdfContent) return;

        setIsLoadingPlan(true);
        try {
            const plan = await generateStudyPlan(
                pdfContent,
                learningState?.weakConcepts || []
            );
            setStudyPlan(plan);
            setActiveTab('plan');
        } catch (error) {
            console.error('Error generating study plan:', error);
        } finally {
            setIsLoadingPlan(false);
        }
    }

    async function handleGenerateSheet() {
        if (!pdfContent) return;

        setIsLoadingSheet(true);
        try {
            const sheet = await generateRevisionSheet(
                pdfContent,
                learningState?.weakConcepts || []
            );
            setRevisionSheet(sheet);
            setActiveTab('sheet');
        } catch (error) {
            console.error('Error generating revision sheet:', error);
        } finally {
            setIsLoadingSheet(false);
        }
    }

    if (!hasPDF) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-accent-purple/20 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Document Loaded</h3>
                <p className="text-gray-400 max-w-sm">
                    Upload a PDF document to generate personalized study plans and revision sheets.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Action Buttons */}
            <div className="p-4 border-b border-white/10 flex gap-4 flex-wrap">
                <Button
                    onClick={handleGeneratePlan}
                    loading={isLoadingPlan}
                    disabled={isLoadingPlan || isLoadingSheet}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Generate Study Plan
                </Button>

                <Button
                    onClick={handleGenerateSheet}
                    loading={isLoadingSheet}
                    disabled={isLoadingPlan || isLoadingSheet}
                    variant="secondary"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Revision Sheet
                </Button>

                {(studyPlan || revisionSheet) && (
                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${activeTab === 'plan'
                                    ? 'bg-accent-purple text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            disabled={!studyPlan}
                        >
                            Study Plan
                        </button>
                        <button
                            onClick={() => setActiveTab('sheet')}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${activeTab === 'sheet'
                                    ? 'bg-accent-purple text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            disabled={!revisionSheet}
                        >
                            Revision Sheet
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {!studyPlan && !revisionSheet ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-accent-cyan/20 flex items-center justify-center mb-4 animate-float">
                            <svg className="w-8 h-8 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Ready to Plan</h3>
                        <p className="text-gray-400 max-w-sm">
                            Click "Generate Study Plan" to get a personalized learning path based on your document
                            and learning progress.
                        </p>
                    </div>
                ) : (
                    <div className="glass-card p-6 markdown-content">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-medium text-accent-purple mt-4 mb-2">{children}</h3>,
                                p: ({ children }) => <p className="text-gray-300 mb-3">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-300">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-300">{children}</ol>,
                                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-accent-purple pl-4 my-3 italic text-gray-400">
                                        {children}
                                    </blockquote>
                                )
                            }}
                        >
                            {activeTab === 'plan' ? studyPlan : revisionSheet}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudyPlan;
