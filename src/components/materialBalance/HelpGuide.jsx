import React from 'react';
import { useHelp } from '@/contexts/HelpContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, Bookmark, BookmarkCheck, Settings, Bell } from 'lucide-react';
import { helpCategories } from '@/data/materialBalanceHelpContent';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Guide Components
import GettingStartedGuide from './guides/GettingStartedGuide';
import FeaturesGuide from './guides/FeaturesGuide';
import WorkflowsGuide from './guides/WorkflowsGuide';
import TroubleshootingGuide from './guides/TroubleshootingGuide';
import FAQSection from './guides/FAQSection';
import Glossary from './guides/Glossary';
import BestPracticesGuide from './guides/BestPracticesGuide';
import QuickReferenceCard from './guides/QuickReferenceCard';
import KeyboardShortcutsGuide from './guides/KeyboardShortcutsGuide';
import HelpAdminPanel from './admin/HelpAdminPanel';
import FeedbackForm from './FeedbackForm';
import SupportContactForm from './SupportContactForm'; // New
import HelpSettings from './HelpSettings'; // New
import HelpNotifications from './HelpNotifications'; // New

const HelpGuide = ({ embedded = false }) => {
  const { 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery, 
    searchResults,
    addToHistory,
    bookmarks,
    toggleBookmark
  } = useHelp();

  // Track view when category changes
  React.useEffect(() => {
    if(activeCategory && !['settings', 'notifications', 'support', 'feedback'].includes(activeCategory)) {
        addToHistory(activeCategory);
    }
  }, [activeCategory]);

  const renderContent = () => {
    if (searchQuery) {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Search Results for "{searchQuery}"</h2>
          {searchResults.length === 0 ? (
             <p className="text-slate-400">No results found.</p>
          ) : (
            <div className="grid gap-4">
               {searchResults.map((res, i) => (
                 <div 
                   key={i} 
                   className="bg-slate-900 p-4 rounded border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                   onClick={() => {
                     setActiveCategory(res.category);
                     setSearchQuery('');
                   }}
                 >
                    <div className="flex justify-between">
                       <h3 className="font-semibold text-[#BFFF00] mb-1">{res.title}</h3>
                       <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 h-fit capitalize">{res.type}</span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2">{res.preview}</p>
                 </div>
               ))}
            </div>
          )}
        </div>
      );
    }

    switch (activeCategory) {
      case 'getting-started': return <GettingStartedGuide />;
      case 'features': return <FeaturesGuide />;
      case 'workflows': return <WorkflowsGuide />;
      case 'troubleshooting': return <TroubleshootingGuide />;
      case 'faq': return <FAQSection />;
      case 'best-practices': return <BestPracticesGuide />;
      case 'glossary': return <Glossary />;
      case 'quick-ref': return <QuickReferenceCard />;
      case 'shortcuts': return <KeyboardShortcutsGuide />;
      case 'feedback': return <FeedbackForm />;
      case 'support': return <SupportContactForm />;
      case 'settings': return <HelpSettings />;
      case 'notifications': return <HelpNotifications />;
      case 'admin': return <HelpAdminPanel />;
      default: return <GettingStartedGuide />;
    }
  };

  const isBookmarked = bookmarks.includes(activeCategory);

  return (
    <div className={cn("flex h-full bg-[#0F172A] text-white", embedded ? "" : "rounded-lg border border-slate-800 overflow-hidden")}>
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
           <div className="relative">
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
             <Input 
               placeholder="Search help..." 
               className="pl-8 bg-slate-900 border-slate-700 text-white"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {helpCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3",
                  activeCategory === cat.id && !searchQuery
                    ? "bg-slate-800 text-[#BFFF00]"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                )}
              >
                {cat.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
                <div className="px-3 text-xs font-semibold text-slate-500 uppercase mb-2">Tools</div>
                <button
                  onClick={() => { setActiveCategory('quick-ref'); setSearchQuery(''); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3",
                    activeCategory === 'quick-ref' ? "bg-slate-800 text-[#BFFF00]" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
               >
                 Quick Reference
               </button>
               <button
                  onClick={() => { setActiveCategory('shortcuts'); setSearchQuery(''); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3",
                    activeCategory === 'shortcuts' ? "bg-slate-800 text-[#BFFF00]" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
               >
                 Keyboard Shortcuts
               </button>
               <button
                  onClick={() => { setActiveCategory('notifications'); setSearchQuery(''); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3",
                    activeCategory === 'notifications' ? "bg-slate-800 text-[#BFFF00]" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
               >
                 Notifications
               </button>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
                <div className="px-3 text-xs font-semibold text-slate-500 uppercase mb-2">Support</div>
                <button
                  onClick={() => { setActiveCategory('support'); setSearchQuery(''); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3",
                    activeCategory === 'support' ? "bg-slate-800 text-[#BFFF00]" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
               >
                 Contact Support
               </button>
               <button
                  onClick={() => { setActiveCategory('feedback'); setSearchQuery(''); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3",
                    activeCategory === 'feedback' ? "bg-slate-800 text-[#BFFF00]" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
               >
                 Send Feedback
               </button>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-slate-800">
             <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-slate-400 hover:text-white"
                onClick={() => setActiveCategory('settings')}
             >
                <Settings className="w-4 h-4 mr-2" /> Settings
             </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Breadcrumb / Header */}
         <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
            <div className="flex items-center text-sm text-slate-400">
               <span>Help</span>
               <ChevronRight className="w-4 h-4 mx-2" />
               <span className="text-white font-medium capitalize">{activeCategory.replace('-', ' ')}</span>
            </div>
            
            <div className="flex items-center gap-2">
               {!['settings', 'support', 'feedback', 'notifications'].includes(activeCategory) && (
                   <Button 
                     variant="ghost" 
                     size="sm"
                     className={cn("text-slate-400 hover:text-white", isBookmarked && "text-[#BFFF00] hover:text-[#BFFF00]")}
                     onClick={() => toggleBookmark(activeCategory)}
                     title={isBookmarked ? "Remove Bookmark" : "Bookmark this topic"}
                   >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                   </Button>
               )}
            </div>
         </div>

         <div className="flex-1 overflow-auto p-8">
            <div className="max-w-4xl mx-auto">
                {renderContent()}
            </div>
         </div>
      </div>
    </div>
  );
};

export default HelpGuide;