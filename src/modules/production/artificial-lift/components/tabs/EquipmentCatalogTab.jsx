import React from 'react';
import EquipmentCatalogBrowser from '../EquipmentCatalogBrowser';

const EquipmentCatalogTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Equipment Catalog</h2>
        <p className="text-slate-400">Browse and select equipment for your design.</p>
      </div>
      
      <EquipmentCatalogBrowser />
    </div>
  );
};

export default EquipmentCatalogTab;