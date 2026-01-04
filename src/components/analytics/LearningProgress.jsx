// Learning Progress Component
// Displays charts for learning analytics

import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useLearningState } from '../../hooks/useLearningState';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export function LearningProgress() {
    const { learningState, weeklyStats, isLoading } = useLearningState();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="animate-spin h-8 w-8 text-accent-purple" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    // Weekly activity chart data
    const weeklyChartData = {
        labels: weeklyStats.map(d => d.day),
        datasets: [
            {
                label: 'Study Time (minutes)',
                data: weeklyStats.map(d => d.minutes),
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1,
                borderRadius: 8,
            }
        ]
    };

    const weeklyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Weekly Study Activity',
                color: '#fff',
                font: { size: 14, weight: '500' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        }
    };

    // Concept mastery chart
    const masteredCount = learningState?.masteredConcepts?.length || 0;
    const weakCount = learningState?.weakConcepts?.length || 0;
    const inProgressCount = Math.max(0, 10 - masteredCount - weakCount); // Assume 10 total concepts

    const masteryChartData = {
        labels: ['Mastered', 'Needs Work', 'In Progress'],
        datasets: [
            {
                data: [masteredCount, weakCount, inProgressCount],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(107, 114, 128, 1)'
                ],
                borderWidth: 2,
            }
        ]
    };

    const masteryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#9ca3af', padding: 20 }
            },
            title: {
                display: true,
                text: 'Concept Mastery',
                color: '#fff',
                font: { size: 14, weight: '500' }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{masteredCount}</p>
                            <p className="text-sm text-gray-400">Concepts Mastered</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{learningState?.totalStudyTime || 0}</p>
                            <p className="text-sm text-gray-400">Minutes Studied</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{learningState?.studySessions || 0}</p>
                            <p className="text-sm text-gray-400">Study Sessions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-4">
                    <div className="h-64">
                        <Bar data={weeklyChartData} options={weeklyChartOptions} />
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="h-64">
                        <Doughnut data={masteryChartData} options={masteryChartOptions} />
                    </div>
                </div>
            </div>

            {/* Weak Concepts List */}
            {learningState?.weakConcepts?.length > 0 && (
                <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Areas for Improvement</h3>
                    <div className="flex flex-wrap gap-2">
                        {learningState.weakConcepts.map((concept, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-sm text-red-300"
                            >
                                {concept}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Misconceptions */}
            {learningState?.misconceptions?.length > 0 && (
                <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Past Misconceptions</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {learningState.misconceptions.slice(-5).map((item, index) => (
                            <div key={index} className="p-3 bg-dark-700 rounded-lg">
                                <p className="text-sm text-red-300 line-through">{item.concept}</p>
                                <p className="text-sm text-green-300 mt-1">✓ {item.correction}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LearningProgress;
