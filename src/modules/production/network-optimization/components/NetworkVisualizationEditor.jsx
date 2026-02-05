import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { Plus, Maximize } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NodeForm from './forms/NodeForm';
import PipelineForm from './forms/PipelineForm';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

const NetworkVisualizationEditor = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const { 
    nodes, 
    pipelines, 
    updateNode, 
    setSelectedNode, 
    setSelectedPipeline,
    selectedNode,
    selectedPipeline,
    deleteNode,
    deletePipeline
  } = useNetworkOptimization();

  // Dialog States
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [dragPipelineStart, setDragPipelineStart] = useState(null);

  // Scales need to be accessible for interactions
  const [scales, setScales] = useState({ x: null, y: null });

  // Update Node Position
  const handleDragEnd = (event, d) => {
    // Invert scale to get real data coordinates from pixel coordinates
    if (!scales.x || !scales.y) return;
    
    // Note: D3 v7 drag events provide x,y relative to parent if subject is configured,
    // but here we might just use the event.x/y if we bind data correctly.
    // However, simplest way with d3-drag is usually updating the data bound to the selection.
    
    // For React integration, we dispatch the update to context
    // d.x and d.y are updated by d3 drag behavior visually, we need to persist it.
    // Actually, we should probably calculate the new domain value.
    
    // Simplified: Just log for now or direct update if we had the inverse scale handy inside the d3 closure
    // Real implementation requires careful d3/react sync.
    // We will trigger a modal or just assume success for this "Editor" prototype phase.
    
    // Re-implementation of drag with direct update:
    // We can't easily invert without the scale object in the closure, so we rely on the D3 event transform.
  };


  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom().scaleExtent([0.1, 4]).on('zoom', (e) => {
        g.attr('transform', e.transform);
    });
    svg.call(zoom);

    // Initial Scales
    // If no nodes, default to 0-1000
    const xExtent = nodes.length > 0 ? d3.extent(nodes, d => d.location.x) : [0, 1000];
    const yExtent = nodes.length > 0 ? d3.extent(nodes, d => d.location.y) : [0, 1000];
    const padding = 100;
    
    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - padding, xExtent[1] + padding])
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - padding, yExtent[1] + padding])
      .range([height - 50, 50]);

    setScales({ x: xScale, y: yScale });

    // --- PIPELINES ---
    g.selectAll('line.pipeline')
        .data(pipelines)
        .enter()
        .append('line')
        .attr('x1', d => { const n = nodes.find(n => n.node_id === d.from_node_id); return n ? xScale(n.location.x) : 0; })
        .attr('y1', d => { const n = nodes.find(n => n.node_id === d.from_node_id); return n ? yScale(n.location.y) : 0; })
        .attr('x2', d => { const n = nodes.find(n => n.node_id === d.to_node_id); return n ? xScale(n.location.x) : 0; })
        .attr('y2', d => { const n = nodes.find(n => n.node_id === d.to_node_id); return n ? yScale(n.location.y) : 0; })
        .attr('stroke', d => selectedPipeline?.pipeline_id === d.pipeline_id ? '#10B981' : '#64748B')
        .attr('stroke-width', d => selectedPipeline?.pipeline_id === d.pipeline_id ? 4 : 2)
        .attr('cursor', 'pointer')
        .on('click', (e, d) => {
            e.stopPropagation();
            setSelectedPipeline(d);
            setSelectedNode(null);
        });

    // --- NODES ---
    const drag = d3.drag()
        .on('start', function() { d3.select(this).raise().attr('stroke', 'white'); })
        .on('drag', function(event, d) {
             d3.select(this).attr('transform', `translate(${event.x}, ${event.y})`);
             // Update connecting lines dynamically would go here
        })
        .on('end', function(event, d) {
            // Calculate new simulation coordinates
            const newX = xScale.invert(event.x);
            const newY = yScale.invert(event.y);
            updateNode(d.node_id, { location: { ...d.location, x: newX, y: newY } });
        });

    const nodeGroups = g.selectAll('g.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${xScale(d.location.x)}, ${yScale(d.location.y)})`)
        .call(drag)
        .on('click', (e, d) => {
            e.stopPropagation();
            setSelectedNode(d);
            setSelectedPipeline(null);
        });

    nodeGroups.append('circle')
        .attr('r', 8)
        .attr('fill', d => {
            if (selectedNode?.node_id === d.node_id) return '#10B981';
            switch(d.type) {
                case 'Well': return '#3B82F6';
                case 'Junction': return '#22C55E';
                case 'Separator': return '#EF4444';
                case 'Compressor': return '#F97316';
                case 'Sink': return '#A855F7';
                default: return '#64748B';
            }
        })
        .attr('stroke', '#0F172A')
        .attr('stroke-width', 2);
    
    nodeGroups.append('text')
        .text(d => d.name)
        .attr('dy', -15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#cbd5e1')
        .attr('font-size', '10px')
        .style('pointer-events', 'none');

    // Background Click
    svg.on('dblclick', (event) => {
        // Add Node
        const [x, y] = d3.pointer(event);
        // Inverse transform to get data coordinates
        const transform = d3.zoomTransform(svg.node());
        const transformedX = (x - transform.x) / transform.k;
        const transformedY = (y - transform.y) / transform.k;
        
        const dataX = xScale.invert(transformedX);
        const dataY = yScale.invert(transformedY);
        
        setClickPosition({ x: dataX, y: dataY });
        setIsNodeModalOpen(true);
    });
    
    svg.on('click', () => {
        setSelectedNode(null);
        setSelectedPipeline(null);
    });

  }, [nodes, pipelines, selectedNode, selectedPipeline, containerRef.current?.clientWidth]);

  return (
    <div className="flex-1 relative bg-[#020617] overflow-hidden" ref={containerRef}>
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-slate-900/80 p-2 rounded text-xs text-slate-400 border border-slate-800 backdrop-blur-sm pointer-events-auto">
                <p>Double-click to add node</p>
                <p>Drag nodes to move</p>
                <p>Click to select</p>
            </div>
        </div>
        
        <svg ref={svgRef} className="w-full h-full" style={{cursor: 'crosshair'}}></svg>

        {/* Modal for adding nodes via visualization */}
        <Dialog open={isNodeModalOpen} onOpenChange={setIsNodeModalOpen}>
            <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-slate-800 text-slate-50 p-0 overflow-hidden">
                <NodeForm 
                    initialData={{ location: { x: clickPosition.x, y: clickPosition.y, elevation: 0 }, type: 'Junction', name: 'New Node' }}
                    onSuccess={() => setIsNodeModalOpen(false)}
                    onCancel={() => setIsNodeModalOpen(false)}
                />
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default NetworkVisualizationEditor;