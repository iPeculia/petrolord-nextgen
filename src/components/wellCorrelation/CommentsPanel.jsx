import React, { useState } from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CommentsPanel = () => {
    const { state, actions } = useWellCorrelation();
    const { comments } = state;
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (!text.trim()) return;
        actions.addComment({
            id: Date.now(),
            text,
            author: 'Geologist',
            timestamp: new Date().toISOString()
        });
        setText('');
    };

    return (
        <Card className="bg-slate-950 border-slate-800 h-full flex flex-col">
            <CardHeader className="border-b border-slate-800 pb-3 shrink-0">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-400" /> Interpretive Comments
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {comments.length === 0 && (
                            <p className="text-xs text-center text-slate-500 py-8">No comments yet. Add interpretation notes here.</p>
                        )}
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-300 font-bold">
                                    {comment.author[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs font-semibold text-slate-300">{comment.author}</span>
                                        <span className="text-[10px] text-slate-600">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                                    </div>
                                    <div className="bg-slate-900 p-2 rounded text-xs text-slate-400 border border-slate-800">
                                        {comment.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex gap-2">
                    <Textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a note..."
                        className="min-h-[40px] h-10 bg-slate-950 border-slate-800 text-xs resize-none py-2"
                    />
                    <Button size="icon" className="h-10 w-10 bg-blue-600 hover:bg-blue-500" onClick={handleSubmit}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CommentsPanel;