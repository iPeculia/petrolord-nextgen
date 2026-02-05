import React from 'react';
import { faqItems } from '@/data/materialBalanceHelpContent';

const FAQSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
      <div className="grid gap-6">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#BFFF00] mb-2">{item.question}</h3>
            <p className="text-slate-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;