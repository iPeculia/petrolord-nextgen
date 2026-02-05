import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const WellboreVisualizationCanvas = () => {
  const containerRef = useRef(null);
  const { trajectory_stations } = useTorqueDrag();

  useEffect(() => {
    if (!containerRef.current || trajectory_stations.length === 0) return;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll("*").remove();

    // Dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = containerRef.current.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    // For visual purposes, we'll plot vertical section (North/South or East/West projection) vs TVD
    // Y Axis is TVD (inverted, depth increases downwards)
    // X Axis is Vertical Section / Deviation
    
    const maxTVD = d3.max(trajectory_stations, d => d.true_vertical_depth_ft) || 10000;
    const maxDeviation = d3.max(trajectory_stations, d => Math.abs(d.north_south_ft)) || 1000;
    
    // Maintain aspect ratio for realism if possible, but fit to screen for utility
    const yScale = d3.scaleLinear()
      .domain([0, maxTVD])
      .range([0, height]); // 0 at top

    const xScale = d3.scaleLinear()
      .domain([-maxDeviation * 1.5, maxDeviation * 1.5]) // Center the well
      .range([0, width]);

    // Draw grid
    const xAxis = d3.axisTop(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .style("color", "#fff")
      .call(xAxis.tickSize(height).tickFormat(""));

    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .style("color", "#fff")
      .call(yAxis.tickSize(-width).tickFormat(""));

    // Draw Axes
    svg.append("g")
      .style("color", "#94a3b8")
      .call(d3.axisTop(xScale));

    svg.append("g")
      .style("color", "#94a3b8")
      .call(d3.axisLeft(yScale));

    // Axis Labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -25)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "12px")
      .text("Vertical Section / Deviation (ft)");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "12px")
      .text("True Vertical Depth (ft)");

    // Line Generator
    const line = d3.line()
      .x(d => xScale(d.north_south_ft)) // Simplified projection
      .y(d => yScale(d.true_vertical_depth_ft))
      .curve(d3.curveCatmullRom);

    // Draw Wellbore Path
    svg.append("path")
      .datum(trajectory_stations)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Draw Points/Stations
    svg.selectAll(".station")
      .data(trajectory_stations)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.north_south_ft))
      .attr("cy", d => yScale(d.true_vertical_depth_ft))
      .attr("r", 4)
      .attr("fill", d => {
          if (d.section === 'Vertical') return '#0066cc';
          if (d.section === 'Build') return '#00cc00';
          if (d.section === 'Hold') return '#ffaa00';
          return '#ff3333';
      })
      .attr("stroke", "#1a1a1a")
      .attr("stroke-width", 1);

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 100}, ${height - 100})`);
    
    const sections = ['Vertical', 'Build', 'Hold', 'Drop-off'];
    const colors = ['#0066cc', '#00cc00', '#ffaa00', '#ff3333'];

    sections.forEach((sec, i) => {
        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", i * 20)
            .attr("r", 4)
            .attr("fill", colors[i]);
        
        legend.append("text")
            .attr("x", 15)
            .attr("y", i * 20 + 4)
            .text(sec)
            .attr("fill", "#cbd5e1")
            .attr("font-size", "10px");
    });

  }, [trajectory_stations]);

  return (
    <div className="w-full h-full bg-[#1e293b] rounded-md overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs text-slate-300 pointer-events-none">
        Wellbore Trajectory Visualization
      </div>
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

export default WellboreVisualizationCanvas;