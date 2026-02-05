import React from 'react';
import GeologicalSectionView from './GeologicalSectionView.jsx';

// Simple wrapper to ensure clean separation of concerns and future extensibility
const SectionView = () => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
       <GeologicalSectionView />
    </div>
  );
};

export default SectionView;