import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Send } from 'lucide-react';
import { submitHelpFeedback } from '@/utils/helpAnalytics';

const FeedbackForm = () => {
  const { toast } = useToast();
  const [type, setType] = useState('suggestion');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('5');

  const handleSubmit = () => {
    if (!comment) {
      toast({ title: "Comment Required", variant: "destructive" });
      return;
    }

    submitHelpFeedback({ type, comment, rating });
    
    toast({ 
      title: "Feedback Sent", 
      description: "Thank you for helping us improve!" 
    });
    setComment('');
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center text-white text-lg">
          <MessageSquare className="w-5 h-5 mr-2 text-[#BFFF00]" />
          Send Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-xs text-slate-400">Feedback Type</label>
             <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                   <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                   <SelectItem value="suggestion">Suggestion</SelectItem>
                   <SelectItem value="bug">Bug Report</SelectItem>
                   <SelectItem value="compliment">Compliment</SelectItem>
                   <SelectItem value="other">Other</SelectItem>
                </SelectContent>
             </Select>
           </div>
           <div className="space-y-2">
             <label className="text-xs text-slate-400">Rating</label>
             <Select value={rating} onValueChange={setRating}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                   <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                   <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                   <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                   <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                   <SelectItem value="2">⭐⭐ Poor</SelectItem>
                   <SelectItem value="1">⭐ Terrible</SelectItem>
                </SelectContent>
             </Select>
           </div>
        </div>
        <div className="space-y-2">
           <label className="text-xs text-slate-400">Your Comments</label>
           <Textarea 
             className="bg-slate-950 border-slate-800 text-white min-h-[100px]"
             placeholder="Tell us what you think..."
             value={comment}
             onChange={(e) => setComment(e.target.value)}
           />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900]">
          <Send className="w-4 h-4 mr-2" /> Submit Feedback
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackForm;