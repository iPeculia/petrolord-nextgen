export function clearCanvas(ctx, width, height, color = '#1a1a1a') {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

export function drawGridLines(ctx, depthScale, trackWidth, color = '#334155') {
  const majorTickInterval = 100;
  const minorTickInterval = 20;

  const [startDepth, endDepth] = depthScale.domain();

  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;

  for (let depth = Math.ceil(startDepth / minorTickInterval) * minorTickInterval; depth <= endDepth; depth += minorTickInterval) {
    const y = depthScale(depth);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(trackWidth, y);
    ctx.stroke();
  }

  for (let depth = Math.ceil(startDepth / majorTickInterval) * majorTickInterval; depth <= endDepth; depth += majorTickInterval) {
    const y = depthScale(depth);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(trackWidth, y);
    ctx.stroke();
  }
}

export function drawLogCurve(ctx, samples, depthScale, valueScale, color = '#BFFF00') {
  if (samples.length < 2) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  
  let firstPoint = true;
  for (const sample of samples) {
    const y = depthScale(sample.depth);
    const x = valueScale(sample.value);
    if(isNaN(x) || isNaN(y)) continue;

    if (firstPoint) {
      ctx.moveTo(x, y);
      firstPoint = false;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

export function drawDepthLabels(ctx, depthScale, textColor = '#F1F5F9') {
  const majorTickInterval = 100;
  const minorTickInterval = 20;
  const [startDepth, endDepth] = depthScale.domain();

  ctx.fillStyle = textColor;
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  // Major ticks with labels
  for (let depth = Math.ceil(startDepth / majorTickInterval) * majorTickInterval; depth <= endDepth; depth += majorTickInterval) {
    const y = depthScale(depth);
    ctx.fillText(depth, 50, y);
    ctx.beginPath();
    ctx.moveTo(55, y);
    ctx.lineTo(60, y);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Minor ticks
  for (let depth = Math.ceil(startDepth / minorTickInterval) * minorTickInterval; depth <= endDepth; depth += minorTickInterval) {
    if (depth % majorTickInterval !== 0) {
      const y = depthScale(depth);
      ctx.beginPath();
      ctx.moveTo(58, y);
      ctx.lineTo(60, y);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

export function drawCurveLabel(ctx, name, unit, trackWidth, color = '#F1F5F9') {
  ctx.fillStyle = color;
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, trackWidth / 2, 15);
  ctx.font = '10px sans-serif';
  ctx.fillText(`(${unit})`, trackWidth / 2, 30);
}

export function drawWellTop(ctx, y, color, label, trackWidth, textLeft = true) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(trackWidth, y);
    ctx.stroke();

    ctx.font = '10px sans-serif';
    ctx.textAlign = textLeft ? 'left' : 'right';
    const xPos = textLeft ? 5 : trackWidth - 5;
    ctx.fillText(label, xPos, y - 5);
}

export function drawCorrelationLine(ctx, from, to, color = '#FFD700', isDashed = false) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    if (isDashed) {
        ctx.setLineDash([5, 5]);
    } else {
        ctx.setLineDash([]);
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.setLineDash([]); // Reset for other drawings
}