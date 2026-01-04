// Learn Page
// Main learning interface with PDF upload and chat

import { PDFUploader } from '../components/pdf/PDFUploader';
import { ChatInterface } from '../components/chat/ChatInterface';

export function Learn() {
    return (
        <div className="h-full flex flex-col">
            {/* PDF Upload Section */}
            <div className="p-4 border-b border-white/10">
                <PDFUploader />
            </div>

            {/* Chat Section */}
            <div className="flex-1 min-h-0">
                <ChatInterface />
            </div>
        </div>
    );
}

export default Learn;
