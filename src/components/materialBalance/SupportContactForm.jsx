import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LifeBuoy, Send, Paperclip } from 'lucide-react';

const SupportContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: 'technical',
    priority: 'normal',
    subject: '',
    description: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log("Support Ticket Submitted:", formData);
    
    toast({ 
      title: "Ticket Created", 
      description: "Support request #4829 has been submitted successfully. You will receive an email shortly.",
      variant: "success"
    });
    
    setFormData({ ...formData, subject: '', description: '' });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-white text-xl">
          <LifeBuoy className="w-6 h-6 mr-3 text-[#BFFF00]" />
          Contact Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-slate-400">Issue Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing & Account</SelectItem>
                        <SelectItem value="data">Data Discrepancy</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-slate-400">Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="low">Low - General Question</SelectItem>
                        <SelectItem value="normal">Normal - Non-critical</SelectItem>
                        <SelectItem value="high">High - Feature Broken</SelectItem>
                        <SelectItem value="critical">Critical - System Down</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-2">
            <Label className="text-slate-400">Subject</Label>
            <Input 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Brief summary of the issue..."
                className="bg-slate-950 border-slate-800 text-white"
            />
        </div>

        <div className="space-y-2">
            <Label className="text-slate-400">Description</Label>
            <Textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Please provide details about what happened, steps to reproduce, and what you expected to happen..."
                className="bg-slate-950 border-slate-800 text-white min-h-[150px]"
            />
        </div>

        <div className="space-y-2">
            <Label className="text-slate-400">Contact Email</Label>
            <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="bg-slate-950 border-slate-800 text-white"
            />
        </div>

        <div className="pt-2">
            <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 w-full justify-start">
                <Paperclip className="w-4 h-4 mr-2" /> Attach Screenshots or Logs (Optional)
            </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-4">
        <Button onClick={handleSubmit} className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold">
          <Send className="w-4 h-4 mr-2" /> Submit Ticket
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupportContactForm;