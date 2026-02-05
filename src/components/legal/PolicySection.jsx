import React from 'react';

const PolicySection = ({ id, title, children }) => {
  return (
    <section id={id} className="mb-12 scroll-mt-28 border-b border-slate-800/50 pb-8 last:border-0 print:border-gray-200">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 print:text-black">
        <span className="w-1.5 h-6 bg-[#BFFF00] rounded-full print:bg-black"></span>
        {title}
      </h2>
      <div className="text-slate-300 space-y-4 leading-relaxed print:text-gray-800 text-lg">
        {children}
      </div>
    </section>
  );
};

export default PolicySection;