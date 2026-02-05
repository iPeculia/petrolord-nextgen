import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, FileText, Search } from 'lucide-react';

const NLPPage = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'Hello, I am Petrolord AI. Ask me about well logs, production data, or reports.' },
    { role: 'user', content: 'Show me production for Well A-01 last month.' },
    { role: 'system', content: 'Well A-01 produced 14,500 bbls in October 2024. Average daily rate was 467 bopd.' }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', content: query }]);
    // Simulate response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'system', content: `I analyzed your query: "${query}". I found 3 relevant reports and 2 datasets.` }]);
    }, 1000);
    setQuery('');
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col bg-[#0F172A] text-white animate-in fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Bot className="w-8 h-8 text-[#BFFF00]" />
        Natural Language Processing
      </h1>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Document Analysis Sidebar */}
        <Card className="col-span-4 bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2"><FileText className="w-5 h-5" /> Document Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="Search documents..." className="pl-9 bg-slate-800 border-slate-700" />
            </div>
            <ScrollArea className="flex-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="p-3 mb-2 bg-slate-800/50 rounded border border-slate-700/50 hover:border-slate-600 cursor-pointer">
                  <div className="font-medium text-sm text-slate-200">Drilling_Report_Oct_{i}.pdf</div>
                  <div className="text-xs text-slate-500 mt-1">Contains: bit wear, mud weight, ROP</div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="col-span-8 bg-slate-900 border-slate-800 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-[#BFFF00] text-black' : 'bg-slate-800 text-slate-200'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-slate-800 flex gap-2">
              <Input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question about your data..." 
                className="bg-slate-800 border-slate-700"
              />
              <Button onClick={handleSend} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NLPPage;