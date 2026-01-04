// Concept Map Component
// Visualizes key concepts and their prerequisite relationships

import { useState, useEffect, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { usePDF } from '../../context/PDFContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function ConceptMap() {
    const { pdfContent, hasPDF } = usePDF();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    // Color palette for different concept groups
    const colorPalette = useMemo(() => ({
        'main': '#8b5cf6',
        'sub': '#3b82f6',
        'detail': '#06b6d4',
        'core': '#8b5cf6',
        'fundamental': '#3b82f6',
        'advanced': '#ec4899',
        'application': '#06b6d4',
        'theory': '#10b981',
        'default': '#6b7280'
    }), []);

    // Extract concept map when PDF changes
    useEffect(() => {
        async function loadConceptMap() {
            if (!hasPDF || !pdfContent) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE_URL}/api/concept-map`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: pdfContent })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to generate concept map');
                }

                // Add colors to nodes based on their category
                const coloredNodes = (data.nodes || []).map(node => ({
                    ...node,
                    label: node.name || node.label || node.id,
                    color: colorPalette[node.category?.toLowerCase()] || colorPalette[node.group?.toLowerCase()] || colorPalette.default,
                    val: 8
                }));

                setGraphData({
                    nodes: coloredNodes,
                    links: (data.links || []).map(link => ({
                        ...link,
                        color: 'rgba(139, 92, 246, 0.4)'
                    }))
                });
            } catch (err) {
                setError(err.message || 'Failed to extract concept map. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        loadConceptMap();
    }, [pdfContent, hasPDF, colorPalette]);

    // Node click handler
    const handleNodeClick = useCallback((node) => {
        setSelectedNode(node);
    }, []);

    // Node label renderer
    const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
        const label = node.label;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw glow effect for selected node
        if (selectedNode?.id === node.id) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI);
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(label, node.x, node.y + 16);
    }, [selectedNode]);

    if (!hasPDF) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-accent-purple/20 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Document Loaded</h3>
                <p className="text-gray-400 max-w-sm">
                    Upload a PDF document to see a visual map of the key concepts and their relationships.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <svg className="animate-spin h-12 w-12 text-accent-purple mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <h3 className="text-lg text-white mb-2">Analyzing Document...</h3>
                <p className="text-gray-400">Extracting concepts and relationships</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">Concept Map</h2>
                    <p className="text-sm text-gray-400">
                        {graphData.nodes.length} concepts • {graphData.links.length} connections
                    </p>
                </div>

                {/* Legend */}
                <div className="flex gap-4 text-xs">
                    {Object.entries(colorPalette).slice(0, 4).map(([group, color]) => (
                        <div key={group} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                            <span className="text-gray-400 capitalize">{group}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Graph */}
            <div className="flex-1 relative bg-dark-900">
                <ForceGraph2D
                    graphData={graphData}
                    nodeCanvasObject={nodeCanvasObject}
                    onNodeClick={handleNodeClick}
                    linkColor={() => 'rgba(139, 92, 246, 0.3)'}
                    linkWidth={1}
                    linkDirectionalArrowLength={6}
                    linkDirectionalArrowRelPos={1}
                    backgroundColor="transparent"
                    enableZoomInteraction={true}
                    enablePanInteraction={true}
                />
            </div>

            {/* Selected Node Info */}
            {selectedNode && (
                <div className="absolute bottom-4 left-4 glass-card p-4 max-w-xs">
                    <h4 className="font-semibold text-white mb-1">{selectedNode.label}</h4>
                    <p className="text-xs text-gray-400 capitalize">Category: {selectedNode.group || 'General'}</p>
                </div>
            )}
        </div>
    );
}

export default ConceptMap;
