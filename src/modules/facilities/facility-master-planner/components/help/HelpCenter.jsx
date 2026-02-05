import React, { useState } from 'react';
import { X, Book, FileText, HelpCircle, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import HelpSearchBar from './HelpSearchBar';
import HelpArticleView from './HelpArticleView';
import { helpArticles } from '../../data/HelpArticles';
import { glossaryTerms } from '../../data/GlossaryTerms';

const CategoryList = ({ category, onSelect }) => {
  const articles = helpArticles.filter(a => a.category === category);
  return (
    <div className="grid grid-cols-1 gap-3 p-4">
      {articles.map(article => (
        <button
          key={article.id}
          onClick={() => onSelect(article)}
          className="flex items-start gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:border-blue-500/50 transition-all text-left group"
        >
          <div className="p-2 rounded-md bg-slate-950 group-hover:bg-blue-500/10">
            <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-slate-200 group-hover:text-white">{article.title}</h4>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">Click to read more about this topic...</p>
          </div>
        </button>
      ))}
    </div>
  );
};

const GlossaryView = () => {
  const [filter, setFilter] = useState('');
  const filtered = glossaryTerms.filter(t => t.term.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-6">
      <input
        type="text"
        placeholder="Filter glossary terms..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-6 p-2 bg-slate-900 border border-slate-700 rounded text-white text-sm w-full focus:outline-none focus:border-blue-500"
      />
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6">
          {filtered.sort((a,b) => a.term.localeCompare(b.term)).map((term, i) => (
            <div key={i} className="pb-4 border-b border-slate-800 last:border-0">
              <h3 className="text-lg font-bold text-blue-400">{term.term}</h3>
              <p className="text-slate-300 mt-1">{term.definition}</p>
              {term.example && (
                <div className="mt-2 text-sm text-slate-500 italic">Example: "{term.example}"</div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-slate-500 text-center">No terms found.</div>}
        </div>
      </ScrollArea>
    </div>
  );
};

const HelpCenter = ({ open, onOpenChange }) => {
  const [activeArticle, setActiveArticle] = useState(null);
  const [tab, setTab] = useState('getting-started');

  const handleSelect = (item) => {
    if (item.type === 'Article' || !item.type) {
      setActiveArticle(item);
    } else if (item.type === 'Glossary') {
      setTab('glossary');
      // Could scroll to term logic here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] h-[80vh] bg-[#0f172a] border-slate-800 p-0 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#131b2b]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Help Center</h2>
          </div>
          <div className="w-[400px]">
            <HelpSearchBar onSelect={handleSelect} />
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeArticle ? (
            <HelpArticleView 
              article={activeArticle} 
              onBack={() => setActiveArticle(null)}
              onNavigate={setActiveArticle}
            />
          ) : (
            <Tabs value={tab} onValueChange={setTab} className="h-full flex">
              {/* Sidebar Tabs */}
              <div className="w-[240px] border-r border-slate-800 bg-[#161e2e] pt-4">
                <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-2 w-full">
                  {[
                    { id: 'getting-started', label: 'Getting Started', icon: Book },
                    { id: 'planning-101', label: 'Planning 101', icon: GraduationCap },
                    { id: 'using-app', label: 'Using the App', icon: FileText },
                    { id: 'guidelines', label: 'Guidelines', icon: FileText },
                    { id: 'glossary', label: 'Glossary', icon: Book },
                  ].map(t => (
                    <TabsTrigger
                      key={t.id}
                      value={t.id}
                      className="w-full justify-start px-4 py-3 text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all rounded-md"
                    >
                      <t.icon className="w-4 h-4 mr-3" />
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Main Tab Content */}
              <div className="flex-1 bg-[#1a1a1a]">
                <TabsContent value="getting-started" className="h-full m-0">
                  <ScrollArea className="h-full"><CategoryList category="Getting Started" onSelect={handleSelect} /></ScrollArea>
                </TabsContent>
                <TabsContent value="planning-101" className="h-full m-0">
                  <ScrollArea className="h-full"><CategoryList category="Planning 101" onSelect={handleSelect} /></ScrollArea>
                </TabsContent>
                <TabsContent value="using-app" className="h-full m-0">
                  <ScrollArea className="h-full"><CategoryList category="Using the App" onSelect={handleSelect} /></ScrollArea>
                </TabsContent>
                <TabsContent value="guidelines" className="h-full m-0">
                  <ScrollArea className="h-full"><CategoryList category="Guidelines" onSelect={handleSelect} /></ScrollArea>
                </TabsContent>
                <TabsContent value="glossary" className="h-full m-0">
                  <GlossaryView />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCenter;