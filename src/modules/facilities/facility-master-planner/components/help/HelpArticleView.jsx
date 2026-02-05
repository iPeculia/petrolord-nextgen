import React from 'react';
import { ThumbsUp, ThumbsDown, Share2, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { helpArticles } from '../../data/HelpArticles';

const HelpArticleView = ({ article, onBack, onNavigate }) => {
  if (!article) return null;

  const related = article.relatedIds 
    ? article.relatedIds.map(id => helpArticles.find(a => a.id === id)).filter(Boolean)
    : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-white">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
        <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
        </Button>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <span className="text-sm text-blue-400 font-medium">{article.category}</span>
          <h1 className="text-3xl font-bold mt-2 mb-6">{article.title}</h1>
          
          <div 
            className="prose prose-invert prose-slate max-w-none text-slate-300"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 pt-8 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Was this article helpful?</h3>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="border-slate-700 hover:bg-green-900/20 hover:text-green-400 hover:border-green-900">
                <ThumbsUp className="w-4 h-4 mr-2" /> Yes
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900">
                <ThumbsDown className="w-4 h-4 mr-2" /> No
              </Button>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => onNavigate(item)}
                    className="text-left p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors"
                  >
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.category}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HelpArticleView;