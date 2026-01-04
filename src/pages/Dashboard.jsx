// Dashboard Page
// Main authenticated app shell with navigation

import { useState } from 'react';
import { Sidebar } from '../components/ui/Sidebar';
import { Learn } from './Learn';
import { Analytics } from './Analytics';
import { ConceptMap } from '../components/analytics/ConceptMap';
import { StudyPlan } from '../components/analytics/StudyPlan';

export function Dashboard() {
    const [currentPage, setCurrentPage] = useState('learn');

    const renderPage = () => {
        switch (currentPage) {
            case 'learn':
                return <Learn />;
            case 'concepts':
                return <ConceptMap />;
            case 'analytics':
                return <Analytics />;
            case 'study-plan':
                return <StudyPlan />;
            default:
                return <Learn />;
        }
    };

    return (
        <div className="min-h-screen bg-dark-900">
            {/* Sidebar */}
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

            {/* Main Content */}
            <main className="ml-64 h-screen overflow-hidden">
                <div className="h-full glass">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
