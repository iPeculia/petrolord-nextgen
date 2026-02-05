import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Calendar, Upload, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import UniversitySelect from '@/components/AddUserForm/UniversitySelect';
import { ScheduledImportService } from '@/services/scheduledImportService';

const ScheduledImportForm = ({ initialData, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    university_id: '',
    frequency: 'once',
    schedule_config: {
        time: '00:00',
        days: [], // for weekly: 1=Mon, 7=Sun
        dayOfMonth: 1
    },
    status: 'active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        university_id: initialData.university_id,
        frequency: initialData.frequency,
        schedule_config: initialData.schedule_config || {},
        status: initialData.status
      });
      // File cannot be pre-filled easily for security reasons, user must re-upload if changing
    }
  }, [initialData]);

  const calculateNextRun = (freq, config) => {
      // Simple client-side preview logic
      const now = new Date();
      let next = new Date();
      const [hours, minutes] = (config.time || "00:00").split(':').map(Number);
      next.setHours(hours, minutes, 0, 0);

      if (next <= now) {
          next.setDate(next.getDate() + 1);
      }

      if (freq === 'weekly') {
          // Logic to find next specific day would go here
          // For simplicity in preview, just showing date
      }
      return next.toLocaleString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.university_id) {
        toast({ title: "Validation Error", description: "Name and University are required.", variant: "destructive" });
        return;
    }
    if (!initialData && !file) {
        toast({ title: "File Required", description: "Please upload a CSV file template.", variant: "destructive" });
        return;
    }

    setLoading(true);
    try {
        let filePath = initialData?.file_path;
        let originalFilename = initialData?.original_filename;

        if (file) {
            const uploadRes = await ScheduledImportService.uploadImportFile(file);
            filePath = uploadRes.filePath;
            originalFilename = uploadRes.fileName;
        }

        // Calculate initial next_run_at
        // In a real app, this should be robust using a library like 'later' or 'cron-parser'
        const nextRun = new Date(); // Simplified: Runs immediately or next cycle
        if (formData.frequency === 'once') {
             // For 'once', usually imply soon or scheduled date. Let's assume now + 5 mins for demo
             nextRun.setMinutes(nextRun.getMinutes() + 5);
        }

        const payload = {
            ...formData,
            file_path: filePath,
            original_filename: originalFilename,
            next_run_at: nextRun.toISOString() 
        };

        if (initialData) {
            await ScheduledImportService.updateScheduledImport(initialData.id, payload);
            toast({ title: "Updated", description: "Schedule updated successfully." });
        } else {
            await ScheduledImportService.createScheduledImport(payload);
            toast({ title: "Created", description: "New schedule created successfully." });
        }
        onSave();
    } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Schedule Name</Label>
                <Input 
                    placeholder="e.g. Monthly Staff Update" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-900 border-slate-700"
                />
            </div>
            <div className="space-y-2">
                <Label>University</Label>
                <UniversitySelect 
                    value={formData.university_id}
                    onChange={(id) => setFormData({...formData, university_id: id})}
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label>Import File (CSV)</Label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <Input 
                    type="file" 
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden" 
                    id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer text-blue-400 hover:text-blue-300">
                    {file ? file.name : (initialData ? `Keep existing: ${initialData.original_filename}` : "Click to upload CSV")}
                </Label>
                <p className="text-xs text-slate-500 mt-1">Upload the template file that will be processed.</p>
            </div>
        </div>

        <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-[#BFFF00]" />
                    <h3 className="font-semibold text-white">Frequency Settings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Repeats</Label>
                        <Select 
                            value={formData.frequency} 
                            onValueChange={(val) => setFormData({...formData, frequency: val})}
                        >
                            <SelectTrigger className="bg-slate-950 border-slate-800">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="once">Run Once</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Time of Day (UTC)</Label>
                        <Input 
                            type="time" 
                            value={formData.schedule_config.time}
                            onChange={(e) => setFormData({
                                ...formData, 
                                schedule_config: { ...formData.schedule_config, time: e.target.value }
                            })}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>
                </div>

                <div className="mt-4 bg-slate-950/50 p-3 rounded border border-slate-800 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-slate-300">Schedule Preview</p>
                        <p className="text-xs text-slate-500">
                            First run: {calculateNextRun(formData.frequency, formData.schedule_config)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 sticky bottom-0 bg-[#0F172A] p-4 border-t border-slate-800 -mx-4 -mb-4 mt-8">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-[#BFFF00] text-black hover:bg-[#a6dd00]">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {initialData ? 'Update Schedule' : 'Create Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default ScheduledImportForm;