import React from 'react';
import { useSeismicStore } from '@/modules/geoscience/seismic-interpretation/store/seismicStore';
import { traceHeaderMap } from '@/modules/geoscience/seismic-interpretation/models/segyDataModel';

const TraceHeaderInspector = () => {
  const { selectedTraceIndex, traceHeaders } = useSeismicStore();

  if (selectedTraceIndex === null || !traceHeaders || traceHeaders.length === 0) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">Trace Header</h3>
        <p className="text-sm text-muted-foreground">Select a trace in the viewer to inspect its header.</p>
      </div>
    );
  }
  
  const header = traceHeaders[selectedTraceIndex];
  
  if (!header) {
      return <div className="p-4 text-sm text-destructive">Could not find header for trace {selectedTraceIndex}.</div>
  }

  // Create a mapping from traceHeaderMap for display
  const displayableHeader = traceHeaderMap.map(item => ({
      name: item.key,
      value: header[item.key] !== undefined ? header[item.key].toString() : 'N/A'
  }));

  return (
    <div className="p-4 flex flex-col h-full">
      <h3 className="font-semibold text-lg mb-4">Trace #{selectedTraceIndex + 1} Header</h3>
      <div className="flex-grow overflow-y-auto text-xs">
        <table className="w-full">
            <thead className="sticky top-0 bg-slate-900">
                <tr>
                    <th className="text-left font-semibold p-1">Field</th>
                    <th className="text-right font-semibold p-1">Value</th>
                </tr>
            </thead>
          <tbody>
            {displayableHeader.map(({ name, value }) => (
              <tr key={name} className="border-b border-slate-800">
                <td className="py-1 px-1 font-mono text-muted-foreground truncate" title={name}>{name}</td>
                <td className="py-1 px-1 text-right font-semibold">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TraceHeaderInspector;