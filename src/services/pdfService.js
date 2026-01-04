// PDF Service
// Handles PDF file reading and text extraction using PDF.js

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
// Using the bundled worker from pdfjs-dist package
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text content from a PDF file
 * @param {File} file - The PDF file object from input/drag-drop
 * @returns {Promise<string>} - The extracted text content
 */
export async function extractTextFromPDF(file) {
    try {
        // Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        // Iterate through all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            // Get the page
            const page = await pdf.getPage(pageNum);

            // Extract text content
            const textContent = await page.getTextContent();

            // Combine all text items
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');

            fullText += `\n--- Page ${pageNum} ---\n${pageText}`;
        }

        return fullText.trim();
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
    }
}

/**
 * Get PDF metadata (title, author, page count)
 * @param {File} file - The PDF file object
 * @returns {Promise<Object>} - PDF metadata
 */
export async function getPDFMetadata(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const metadata = await pdf.getMetadata();

        return {
            title: metadata.info?.Title || file.name,
            author: metadata.info?.Author || 'Unknown',
            pageCount: pdf.numPages,
            fileName: file.name,
            fileSize: formatFileSize(file.size)
        };
    } catch (error) {
        console.error('Error getting PDF metadata:', error);
        return {
            title: file.name,
            author: 'Unknown',
            pageCount: 0,
            fileName: file.name,
            fileSize: formatFileSize(file.size)
        };
    }
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate if a file is a PDF
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid PDF
 */
export function isValidPDF(file) {
    return file && file.type === 'application/pdf';
}
