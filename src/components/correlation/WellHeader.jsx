import React from 'react';

const WellHeader = ({ well, isSelected, onSelect, width }) => {
    const headerStyle = {
        backgroundColor: isSelected ? '#BFFF00' : '#1E293B',
        color: isSelected ? '#0F172A' : '#F1F5F9',
        width: `${width}px`
    };

    return (
        <div 
            className="h-[60px] p-2 flex flex-col justify-center items-center cursor-pointer border-x border-b border-slate-700 flex-shrink-0"
            style={headerStyle}
            onClick={onSelect}
        >
            <div className="font-bold text-sm truncate w-full text-center">{well.name}</div>
            <div className="text-xs text-slate-400">{well.field || 'N/A'}</div>
        </div>
    );
};

export default WellHeader;