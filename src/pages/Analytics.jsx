// Analytics Page
// Shows learning progress and marks analysis

import { useState } from 'react';
import { LearningProgress } from '../components/analytics/LearningProgress';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function Analytics() {
    const [activeTab, setActiveTab] = useState('progress');

    // Simulated marks data for what-if analysis
    const [marksData, setMarksData] = useState([
        { subject: 'Quiz 1', marks: 75, maxMarks: 100 },
        { subject: 'Quiz 2', marks: 82, maxMarks: 100 },
        { subject: 'Midterm', marks: 68, maxMarks: 100 },
        { subject: 'Quiz 3', marks: 88, maxMarks: 100 },
    ]);

    const [newMark, setNewMark] = useState({ subject: '', marks: '', maxMarks: '100' });

    const handleAddMark = (e) => {
        e.preventDefault();
        if (newMark.subject && newMark.marks) {
            setMarksData([...marksData, {
                subject: newMark.subject,
                marks: parseInt(newMark.marks),
                maxMarks: parseInt(newMark.maxMarks)
            }]);
            setNewMark({ subject: '', marks: '', maxMarks: '100' });
        }
    };

    // Marks vs Rank Chart (Simulated)
    const marksChartData = {
        labels: marksData.map(d => d.subject),
        datasets: [
            {
                label: 'Your Marks (%)',
                data: marksData.map(d => (d.marks / d.maxMarks) * 100),
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Class Average (Simulated)',
                data: marksData.map(() => 70 + Math.random() * 10),
                borderColor: 'rgba(107, 114, 128, 1)',
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                borderDash: [5, 5],
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9ca3af' }
            },
            title: {
                display: true,
                text: 'Performance Trend (Simulated Data)',
                color: '#fff',
                font: { size: 14, weight: '500' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        }
    };

    // Calculate average and projected rank
    const avgMarks = marksData.length > 0
        ? marksData.reduce((sum, d) => sum + (d.marks / d.maxMarks) * 100, 0) / marksData.length
        : 0;

    // Simple simulated rank calculation
    const simulatedRank = Math.max(1, Math.round(100 - avgMarks));

    return (
        <div className="h-full flex flex-col">
            {/* Tabs */}
            <div className="p-4 border-b border-white/10 flex gap-4">
                <button
                    onClick={() => setActiveTab('progress')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'progress'
                            ? 'bg-accent-purple text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Learning Progress
                </button>
                <button
                    onClick={() => setActiveTab('marks')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'marks'
                            ? 'bg-accent-purple text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Marks Analysis
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'progress' ? (
                    <LearningProgress />
                ) : (
                    <div className="space-y-6">
                        {/* Warning Banner */}
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="font-medium text-yellow-400">Simulated Data</p>
                                <p className="text-sm text-yellow-300/80">
                                    This section uses user-input and simulated data for what-if analysis only.
                                    Ranks and class averages are not real.
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="glass-card p-4">
                                <p className="text-sm text-gray-400">Average Score</p>
                                <p className="text-3xl font-bold text-white">{avgMarks.toFixed(1)}%</p>
                            </div>
                            <div className="glass-card p-4">
                                <p className="text-sm text-gray-400">Projected Rank (Simulated)</p>
                                <p className="text-3xl font-bold text-accent-purple">#{simulatedRank}</p>
                            </div>
                            <div className="glass-card p-4">
                                <p className="text-sm text-gray-400">Tests Recorded</p>
                                <p className="text-3xl font-bold text-white">{marksData.length}</p>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="glass-card p-4">
                            <div className="h-64">
                                <Line data={marksChartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Add New Mark */}
                        <div className="glass-card p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Add Test Score</h3>
                            <form onSubmit={handleAddMark} className="flex gap-3 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="Test Name"
                                    value={newMark.subject}
                                    onChange={(e) => setNewMark({ ...newMark, subject: e.target.value })}
                                    className="flex-1 min-w-[150px] px-4 py-2 rounded-lg bg-dark-700 border border-white/10 
                           text-white placeholder-gray-500 focus:border-accent-purple outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Score"
                                    value={newMark.marks}
                                    onChange={(e) => setNewMark({ ...newMark, marks: e.target.value })}
                                    className="w-24 px-4 py-2 rounded-lg bg-dark-700 border border-white/10 
                           text-white placeholder-gray-500 focus:border-accent-purple outline-none"
                                />
                                <span className="flex items-center text-gray-400">/</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={newMark.maxMarks}
                                    onChange={(e) => setNewMark({ ...newMark, maxMarks: e.target.value })}
                                    className="w-24 px-4 py-2 rounded-lg bg-dark-700 border border-white/10 
                           text-white placeholder-gray-500 focus:border-accent-purple outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 glass-button text-white"
                                >
                                    Add
                                </button>
                            </form>
                        </div>

                        {/* Marks List */}
                        <div className="glass-card p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Recorded Scores</h3>
                            <div className="space-y-2">
                                {marksData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                        <span className="text-white">{item.subject}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-400">{item.marks}/{item.maxMarks}</span>
                                            <span className={`font-medium ${(item.marks / item.maxMarks) >= 0.8 ? 'text-green-400' :
                                                    (item.marks / item.maxMarks) >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                {((item.marks / item.maxMarks) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analytics;
