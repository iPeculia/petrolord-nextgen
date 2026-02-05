import React from 'react';
import { glossaryTerms } from '@/data/materialBalanceHelpContent';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Glossary = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Glossary of Terms</h2>
      <div className="rounded-md border border-slate-800 bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="text-slate-400 w-[200px]">Term</TableHead>
              <TableHead className="text-slate-400">Definition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {glossaryTerms.map((term, index) => (
              <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-[#BFFF00]">{term.term}</TableCell>
                <TableCell className="text-slate-300">{term.definition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Glossary;