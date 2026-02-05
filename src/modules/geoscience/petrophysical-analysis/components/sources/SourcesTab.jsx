import React from 'react';
import { SourcesProvider, useSources } from '../../context/SourcesContext';
import SourcesToolbar from './SourcesToolbar';
import SourcesList from './SourcesList';
import SourceDetails from './SourceDetails';

const SourcesContent = () => {
  const { selectedSource } = useSources();

  if (selectedSource) {
      return <SourceDetails />;
  }

  return (
    <div className="flex flex-col h-full bg-[#0B101B] text-slate-200">
      <SourcesToolbar />
      <div className="flex-1 overflow-hidden p-6">
          <SourcesList />
      </div>
    </div>
  );
};

const SourcesTab = () => {
  return (
    <SourcesProvider>
      <SourcesContent />
    </SourcesProvider>
  );
};

export default SourcesTab;