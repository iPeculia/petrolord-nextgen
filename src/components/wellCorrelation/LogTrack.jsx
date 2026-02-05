import React, { useRef, useEffect } from 'react';

const LogTrack = ({ 
    width = 200, 
    height, 
    data, 
    curveName, 
    min = 0, 
    max = 150, 
    color = "#2563eb", 
    fill = false,
    fillColor, 
    scaleType = 'linear' 
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data || data.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Handle HiDPI screens
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.clearRect(0, 0, width, height);

        // Draw Grid
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical Grid Lines
        for (let i = 1; i < 4; i++) {
            const x = (width / 4) * i;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        ctx.stroke();

        // Plot Curve
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;

        const range = max - min;
        const logMin = Math.log10(Math.max(min, 0.1));
        const logMax = Math.log10(Math.max(max, 0.1));
        const logRange = logMax - logMin;

        let hasStarted = false;

        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const val = point.value;
            const y = point.y; // Assumed pre-calculated pixel Y based on depth

            if (val === null || isNaN(val)) {
                hasStarted = false; // Break the line on nulls
                continue;
            }

            let x;
            if (scaleType === 'log') {
                 if (val <= 0) continue;
                 const logVal = Math.log10(val);
                 x = ((logVal - logMin) / logRange) * width;
            } else {
                 x = ((val - min) / range) * width;
            }

            // Clamp for rendering safety
            x = Math.max(0, Math.min(width, x));

            if (!hasStarted) {
                ctx.moveTo(x, y);
                hasStarted = true;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Optional Fill (e.g. Gamma Ray to left or right)
        if (fill && hasStarted) {
            ctx.fillStyle = fillColor || `${color}33`; // Default to low opacity hex
            ctx.lineTo(width, data[data.length-1].y); // Close path to right edge
            ctx.lineTo(width, data[0].y);
            ctx.closePath();
            ctx.fill();
        }

    }, [width, height, data, curveName, min, max, color, fill, fillColor, scaleType]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 pointer-events-none"
        />
    );
};

export default LogTrack;