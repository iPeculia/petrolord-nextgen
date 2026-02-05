import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { helpArticles } from '../../data/HelpArticles';
import { glossaryTerms } from '../../data/GlossaryTerms';

const HelpSearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);

    if (q.length < 2) {
      setResults([]);
      return;
    }

    const lowerQ = q.toLowerCase();
    
    const articleResults = helpArticles.filter(article => 
      article.title.toLowerCase().includes(lowerQ) || 
      article.keywords.some(k => k.toLowerCase().includes(lowerQ))
    ).map(a => ({ type: 'Article', ...a }));

    const termResults = glossaryTerms.filter(term => 
      term.term.toLowerCase().includes(lowerQ) ||
      term.keywords.some(k => k.toLowerCase().includes(lowerQ))
    ).map(t => ({ type: 'Glossary', title: t.term, id: t.term, category: 'Definition' }));

    setResults([...articleResults, ...termResults].slice(0, 8)); // Limit results
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <Input 
          value={query}
          onChange={handleSearch}
          placeholder="Search for help, articles, or definitions..."
          className="pl-9 bg-slate-900 border-slate-700 text-white focus:ring-blue-500"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                  onSelect(item);
                  setQuery('');
                  setResults([]);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{item.title}</span>
                <span className="text-xs text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full">{item.type}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{item.category}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HelpSearchBar;