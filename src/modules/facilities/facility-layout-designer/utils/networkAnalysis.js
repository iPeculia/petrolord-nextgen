export const analyzeNetwork = (items, lines) => {
  const nodes = {};
  items.forEach(i => nodes[i.tag] = { ...i, connections: [] });

  const connectivityReport = [];
  const unconnectedNodes = new Set(items.map(i => i.tag));

  lines.forEach(l => {
    if (nodes[l.from_tag] && nodes[l.to_tag]) {
      nodes[l.from_tag].connections.push({ to: l.to_tag, line: l.line_id, type: 'outlet' });
      nodes[l.to_tag].connections.push({ from: l.from_tag, line: l.line_id, type: 'inlet' });
      
      unconnectedNodes.delete(l.from_tag);
      unconnectedNodes.delete(l.to_tag);
      
      connectivityReport.push({
        source: l.from_tag,
        destination: l.to_tag,
        line: l.line_id,
        status: 'Connected'
      });
    }
  });

  return {
    connectivityReport,
    unconnectedNodes: Array.from(unconnectedNodes),
    nodeGraph: nodes
  };
};