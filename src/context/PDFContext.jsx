// PDF Context
// Provides extracted PDF content throughout the app

import { createContext, useContext, useState } from 'react';
import { extractTextFromPDF, getPDFMetadata } from '../services/pdfService';

// Create the PDF context
const PDFContext = createContext(null);

/**
 * PDF Provider Component
 * Manages PDF content state for the entire app
 */
export function PDFProvider({ children }) {
    const [pdfContent, setPdfContent] = useState('');
    const [pdfMetadata, setPdfMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Load a PDF file and extract its content
     * @param {File} file - The PDF file to load
     */
    async function loadPDF(file) {
        setIsLoading(true);
        setError(null);

        try {
            // Extract text content
            const content = await extractTextFromPDF(file);
            setPdfContent(content);

            // Get metadata
            const metadata = await getPDFMetadata(file);
            setPdfMetadata(metadata);

            setIsLoading(false);
            return { success: true, content, metadata };
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            return { success: false, error: err.message };
        }
    }

    /**
     * Clear the current PDF
     */
    function clearPDF() {
        setPdfContent('');
        setPdfMetadata(null);
        setError(null);
    }

    // Context value
    const value = {
        pdfContent,
        pdfMetadata,
        isLoading,
        error,
        loadPDF,
        clearPDF,
        hasPDF: pdfContent.length > 0
    };

    return (
        <PDFContext.Provider value={value}>
            {children}
        </PDFContext.Provider>
    );
}

/**
 * Custom hook to use PDF context
 */
export function usePDF() {
    const context = useContext(PDFContext);
    if (!context) {
        throw new Error('usePDF must be used within a PDFProvider');
    }
    return context;
}

export default PDFContext;
