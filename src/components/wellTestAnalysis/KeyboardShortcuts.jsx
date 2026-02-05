import React from 'react';
import { Command } from 'lucide-react';

const shortcuts = [
    { key: "Ctrl + I", action: "Import Data" },
    { key: "Ctrl + S", action: "Save Project" },
    { key: "Ctrl + E", action: "Export Results" },
    { key: "D", action: "Toggle Derivative Curve" },
    { key: "R", action: "Reset Plot Zoom" },
    { key: "?", action: "Open Help" }
];

const KeyboardShortcuts = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
            <Command className="w-4 h-4" /> Keyboard Shortcuts
        </h4>
        <div className="grid grid-cols-2 gap-2">
            {shortcuts.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{s.action}</span>
                    <kbd className="bg-slate-800 px-2 py-1 rounded text-slate-300 font-mono text-[10px] border border-slate-700">
                        {s.key}
                    </kbd>
                </div>
            ))}
        </div>
    </div>
  );
};

export default KeyboardShortcuts;