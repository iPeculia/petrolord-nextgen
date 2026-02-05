import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

const KeyboardShortcutsGuide = () => {
  const shortcuts = [
    { keys: ["?"], action: "Open Help Modal", context: "Global" },
    { keys: ["Ctrl", "S"], action: "Save Project", context: "Editor" },
    { keys: ["Ctrl", "E"], action: "Export Data", context: "Global" },
    { keys: ["Ctrl", "I"], action: "Import Data", context: "Data Tab" },
    { keys: ["Ctrl", "F"], action: "Search Help", context: "Global" },
    { keys: ["Ctrl", "P"], action: "Print Report", context: "Reports" },
    { keys: ["Ctrl", "Z"], action: "Undo Last Action", context: "Editor" },
    { keys: ["Ctrl", "Y"], action: "Redo Action", context: "Editor" },
    { keys: ["Esc"], action: "Close Modal/Sidebar", context: "UI" },
    { keys: ["Tab"], action: "Navigate Fields", context: "Forms" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-800 rounded-lg">
           <Keyboard className="w-6 h-6 text-[#BFFF00]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
          <p className="text-slate-400">Boost your productivity with these key combinations.</p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400 w-[200px]">Shortcut</TableHead>
                <TableHead className="text-slate-400">Action</TableHead>
                <TableHead className="text-slate-400">Context</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shortcuts.map((item, idx) => (
                <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell>
                    <div className="flex gap-1">
                      {item.keys.map((k, i) => (
                        <kbd key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white font-mono shadow-sm">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-medium">{item.action}</TableCell>
                  <TableCell className="text-slate-400 text-xs">{item.context}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyboardShortcutsGuide;