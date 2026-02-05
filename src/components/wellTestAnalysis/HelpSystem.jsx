import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HelpCircle, BookOpen, MessageCircle, FileText, Search, Keyboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Glossary from './Glossary';
import FAQ from './FAQ';
import BestPracticesGuide from './BestPracticesGuide';
import KeyboardShortcuts from './KeyboardShortcuts';

const HelpSystem = ({ isOpen, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] bg-slate-950 border-slate-800 text-white flex flex-col p-0">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
                <HelpCircle className="w-8 h-8 text-blue-400" />
                Well Test Analysis Help Center
            </DialogTitle>
            </DialogHeader>
            <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="Search for terms, workflows, or errors..." 
                    className="pl-10 bg-slate-900 border-slate-700 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <Tabs defaultValue="guide" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="guide" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> User Guide
                    </TabsTrigger>
                    <TabsTrigger value="glossary" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Glossary
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> FAQ & Troubleshooting
                    </TabsTrigger>
                    <TabsTrigger value="shortcuts" className="flex items-center gap-2">
                        <Keyboard className="w-4 h-4" /> Shortcuts
                    </TabsTrigger>
                </TabsList>
            </div>

            <div className="flex-1 p-6 min-h-0 bg-slate-950/30">
                <ScrollArea className="h-full pr-4">
                    <TabsContent value="guide" className="mt-0">
                       <BestPracticesGuide />
                    </TabsContent>
                    
                    <TabsContent value="glossary" className="mt-0">
                        <Glossary filter={searchQuery} />
                    </TabsContent>

                    <TabsContent value="faq" className="mt-0">
                        <FAQ filter={searchQuery} />
                    </TabsContent>

                    <TabsContent value="shortcuts" className="mt-0">
                        <KeyboardShortcuts />
                    </TabsContent>
                </ScrollArea>
            </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HelpSystem;