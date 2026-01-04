// PDF Uploader Component
// Drag-and-drop PDF upload with react-dropzone

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePDF } from '../../context/PDFContext';

export function PDFUploader() {
    const { loadPDF, isLoading, error, hasPDF, pdfMetadata, clearPDF } = usePDF();

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            await loadPDF(file);
        }
    }, [loadPDF]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        disabled: isLoading
    });

    if (hasPDF) {
        return (
            <div className="glass-card p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">{pdfMetadata?.title}</h3>
                            <p className="text-sm text-gray-400">
                                {pdfMetadata?.pageCount} pages • {pdfMetadata?.fileSize}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={clearPDF}
                        className="text-gray-400 hover:text-red-400 transition-colors p-2"
                        title="Remove document"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    Document loaded successfully. You can now start learning with Erudite!
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card p-8">
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive
                        ? 'border-accent-purple bg-accent-purple/10'
                        : 'border-white/20 hover:border-accent-purple/50 hover:bg-white/5'
                    }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-12 w-12 text-accent-purple mb-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-lg text-gray-300">Processing PDF...</p>
                            <p className="text-sm text-gray-500 mt-1">Extracting content for Erudite</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-2xl bg-accent-purple/20 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-lg text-white mb-2">
                                {isDragActive ? 'Drop your PDF here' : 'Upload your study material'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Drag and drop a PDF file, or click to browse
                            </p>
                            <p className="text-xs text-gray-500 mt-4">
                                Supported: PDF documents (lecture notes, textbooks, study guides)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}

export default PDFUploader;
