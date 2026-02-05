import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, RefreshCcw } from 'lucide-react';

const NetworkVisualizationCanvas = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const { 
    nodes, 
    pipelines, 
    facilities, 
    selectedNode, 
    selectedPipeline,
    selectedFacility,
    setSelectedNode, 
    setSelectedPipeline,
    setSelectedFacility,
    nodeResults,
    pipelineResults
  } = useNetworkOptimization();
  
  const [zoomLevel, setZoomLevel] = useState(1);

  // D3 Rendering Logic
  useEffect(() => {
    if (!nodes.length || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Define Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Main Group for transformations
    const g = svg.append('g');

    // --- SCALES ---
    // Simple auto-scaling logic based on node coordinates
    const xExtent = d3.extent(nodes, d => d.location.x);
    const yExtent = d3.extent(nodes, d => d.location.y);
    
    // Add padding
    const padding = 50;
    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - padding, xExtent[1] + padding])
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - padding, yExtent[1] + padding])
      .range([height - 50, 50]); // Invert Y for typical Cartesian

    // --- PIPELINES (Edges) ---
    g.selectAll('line.pipeline')
      .data(pipelines)
      .enter()
      .append('line')
      .attr('class', 'pipeline')
      .attr('x1', d => {
        const node = nodes.find(n => n.node_id === d.from_node_id);
        return node ? xScale(node.location.x) : 0;
      })
      .attr('y1', d => {
        const node = nodes.find(n => n.node_id === d.from_node_id);
        return node ? yScale(node.location.y) : 0;
      })
      .attr('x2', d => {
        const node = nodes.find(n => n.node_id === d.to_node_id);
        return node ? xScale(node.location.x) : 0;
      })
      .attr('y2', d => {
        const node = nodes.find(n => n.node_id === d.to_node_id);
        return node ? yScale(node.location.y) : 0;
      })
      .attr('stroke', d => {
        const isSelected = selectedPipeline?.pipeline_id === d.pipeline_id;
        if (isSelected) return '#10B981'; // Emerald 500
        // Check bottleneck status from results
        const res = pipelineResults.find(r => r.pipeline_id === d.pipeline_id);
        return res?.is_bottleneck ? '#EF4444' : '#475569'; // Red if bottleneck, else Slate 600
      })
      .attr('stroke-width', d => {
         const isSelected = selectedPipeline?.pipeline_id === d.pipeline_id;
         return isSelected ? 4 : 2;
      })
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedPipeline(d);
        setSelectedNode(null);
        setSelectedFacility(null);
      })
      .on('mouseover', function() {
        d3.select(this).attr('stroke-opacity', 0.8);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-opacity', 1);
      });

    // --- NODES ---
    const nodeGroups = g.selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${xScale(d.location.x)}, ${yScale(d.location.y)})`)
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        setSelectedPipeline(null);
        setSelectedFacility(null);
      });

    // Node Circle
    nodeGroups.append('circle')
      .attr('r', d => d.type === 'Junction' ? 6 : 10)
      .attr('fill', d => {
        const isSelected = selectedNode?.node_id === d.node_id;
        if (isSelected) return '#10B981';
        switch(d.type) {
          case 'Well': return '#3B82F6'; // Blue
          case 'Sink': return '#F59E0B'; // Amber
          case 'Separator': return '#8B5CF6'; // Violet
          default: return '#64748B'; // Slate
        }
      })
      .attr('stroke', '#0F172A')
      .attr('stroke-width', 2);

    // Node Label
    nodeGroups.append('text')
      .text(d => d.name)
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94A3B8') // Slate 400
      .attr('font-size', '10px')
      .style('pointer-events', 'none');

    // Node Icon (Simple Text for now or could use SVG paths)
    nodeGroups.filter(d => d.type === 'Well')
      .append('text')
      .text('W')
      .attr('dy', 3)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '8px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // --- FACILITIES ---
    // Facilities often attach to nodes, so we render them near nodes or overlapping
    // For simplicity in this phase, we treat facility nodes specially (icon change)
    // The Facility data model links to a Node ID.
    
    // Background click to deselect
    svg.on('click', () => {
      setSelectedNode(null);
      setSelectedPipeline(null);
      setSelectedFacility(null);
    });

    // Initial Zoom transform to fit bounds could be added here
    
  }, [nodes, pipelines, facilities, selectedNode, selectedPipeline, selectedFacility, nodeResults, pipelineResults, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  return (
    <div className="flex-1 relative bg-[#020617] overflow-hidden" ref={containerRef}>
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        style={{ cursor: 'grab' }}
      />
      
      {/* Canvas Controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
         <div className="bg-slate-900/90 border border-slate-800 rounded-md p-1 flex flex-col gap-1 shadow-lg backdrop-blur-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => {}}>
               <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => {}}>
               <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => {}}>
               <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => {}}>
               <Maximize className="h-4 w-4" />
            </Button>
         </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 rounded-md p-3 shadow-lg backdrop-blur-sm">
         <h4 className="text-xs font-semibold text-slate-300 mb-2">Legend</h4>
         <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-blue-500"></span>
               <span>Well</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-slate-500"></span>
               <span>Junction</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-violet-500"></span>
               <span>Facility</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-6 h-0.5 bg-slate-600"></span>
               <span>Pipeline</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-6 h-0.5 bg-red-500"></span>
               <span>Bottleneck</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default NetworkVisualizationCanvas;