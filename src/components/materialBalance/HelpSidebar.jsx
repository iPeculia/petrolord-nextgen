import React from 'react';
import { useHelp } from '@/contexts/HelpContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, BookOpen, Clock, Star, MessageSquare, LifeBuoy } from 'lucide-react';
import { helpTopics } from '@/data/materialBalanceHelpContent';

const HelpSidebar = () => {
  const { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    searchQuery, 
    setSearchQuery, 
    searchResults,
    history,
    bookmarks,
    setActiveCategory,
    setIsHelpModalOpen
  } = useHelp();

  if (!isSidebarOpen) return null;

  const recentTopics = helpTopics.filter(t => history.slice(0, 3).includes(t.id));
  const bookmarkedTopics = helpTopics.filter(t => bookmarks.includes(t.id));

  const handleNavigate = (category) => {
      setActiveCategory(category);
      // Optional: open full modal if easier to read
      setIsHelpModalOpen(true);
      setIsSidebarOpen(false);
  };

  return (
    <div className="w-80 h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl absolute right-0 top-0 z-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-[#BFFF00]" /> Help Assistant
        </h3>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search for help..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {searchQuery ? (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Search Results</h4>
              {searchResults.length === 0 ? (
                <p className="text-sm text-slate-400">No results found.</p>
              ) : (
                searchResults.map(result => (
                  <Card key={result.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer" onClick={() => handleNavigate(result.category)}>
                    <CardContent className="p-3">
                      <h5 className="text-sm font-medium text-blue-400">{result.title}</h5>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{result.preview}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Quick Links */}
              <div className="space-y-3">
                 <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                   <Star className="w-3 h-3 text-yellow-500" /> Bookmarked
                 </h4>
                 {bookmarkedTopics.length > 0 ? (
                   bookmarkedTopics.map(topic => (
                     <Button 
                        key={topic.id} 
                        variant="ghost" 
                        className="w-full justify-start h-auto py-2 text-sm text-slate-300 hover:text-white px-2"
                        onClick={() => handleNavigate(topic.category)}
                      >
                       {topic.title}
                     </Button>
                   ))
                 ) : (
                   <p className="text-xs text-slate-500 italic px-2">No bookmarks yet.</p>
                 )}
              </div>

              {/* Recent */}
              <div className="space-y-3">
                 <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                   <Clock className="w-3 h-3 text-blue-500" /> Recently Viewed
                 </h4>
                 {recentTopics.length > 0 ? (
                   recentTopics.map(topic => (
                     <Button 
                        key={topic.id} 
                        variant="ghost" 
                        className="w-full justify-start h-auto py-2 text-sm text-slate-300 hover:text-white px-2"
                        onClick={() => handleNavigate(topic.category)}
                      >
                       {topic.title}
                     </Button>
                   ))
                 ) : (
                   <p className="text-xs text-slate-500 italic px-2">No history yet.</p>
                 )}
              </div>

              {/* Popular */}
              <div className="space-y-3">
                 <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                   <BookOpen className="w-3 h-3 text-[#BFFF00]" /> Popular Topics
                 </h4>
                 {helpTopics.slice(0, 3).map(topic => (
                   <Button 
                      key={topic.id} 
                      variant="ghost" 
                      className="w-full justify-start h-auto py-2 text-sm text-slate-300 hover:text-white px-2"
                      onClick={() => handleNavigate(topic.category)}
                    >
                     {topic.title}
                   </Button>
                 ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 grid grid-cols-2 gap-2">
         <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs border-slate-700 hover:bg-slate-800 text-slate-300"
            onClick={() => handleNavigate('feedback')}
         >
           <MessageSquare className="w-3 h-3 mr-2" /> Feedback
         </Button>
         <Button 
            size="sm" 
            className="w-full text-xs bg-[#BFFF00] text-black hover:bg-[#a3d900]"
            onClick={() => handleNavigate('support')}
         >
           Contact Support
         </Button>
      </div>
    </div>
  );
};

export default HelpSidebar;