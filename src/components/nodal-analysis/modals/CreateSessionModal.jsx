import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CreateSessionModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!name.trim()) return;

      setLoading(true);
      try {
          await onCreate(name, description);
          toast({ title: "Session Created", description: `"${name}" is now active.` });
          setName('');
          setDescription('');
          if (onClose) onClose();
      } catch (error) {
          toast({ title: "Error", description: "Failed to create session.", variant: "destructive" });
      } finally {
          setLoading(false);
      }
  };

  // Removed triggerButton logic completely to enforce controlled usage and prevent potential misuse
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Create New Nodal Analysis Session</DialogTitle>
                <DialogDescription className="text-slate-400">
                    Set up a new workspace for system performance analysis.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="session-name">Session Name</Label>
                    <Input 
                        id="session-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Well A-12 Optimization"
                        className="bg-slate-900/50 border-slate-600 focus:border-blue-500"
                        autoFocus
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="session-desc">Description (Optional)</Label>
                    <Textarea 
                        id="session-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief notes about this analysis..."
                        className="bg-slate-900/50 border-slate-600 focus:border-blue-500 resize-none h-24"
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose} className="text-slate-300">Cancel</Button>
                    <Button type="submit" disabled={!name.trim() || loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create Session
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;