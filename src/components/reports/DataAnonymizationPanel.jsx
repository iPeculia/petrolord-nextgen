import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { SlidersHorizontal, UserX, ShieldCheck } from 'lucide-react';
import { logAnonymization } from '@/lib/dataAnonymizationUtils';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ANONYMIZATION_FIELDS = [
    { id: 'user_email', label: 'User Email' },
    { id: 'recipient_email', label: 'Recipient Email' },
    { id: 'ip_address', label: 'IP Address' },
    { id: 'Student', label: 'Student Name' },
];

const DataAnonymizationPanel = ({ onAnonymize, onReset, isAnonymized }) => {
    const { toast } = useToast();
    const { profile } = useAuth();
    const [enabled, setEnabled] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);

    const handleFieldChange = (fieldId, checked) => {
        setSelectedFields(prev =>
            checked ? [...prev, fieldId] : prev.filter(id => id !== fieldId)
        );
    };

    const handleApply = async () => {
        if (selectedFields.length === 0) {
            toast({ variant: 'destructive', title: 'No Fields Selected', description: 'Please select fields to anonymize.' });
            return;
        }
        try {
            await logAnonymization(profile.id, null, 'field_level', selectedFields);
            onAnonymize({ type: 'field_level', fields: selectedFields });
            toast({ title: 'Anonymization Applied', description: 'Report data has been anonymized.' });
        } catch(error) {
             toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };
    
    const handleReset = () => {
        onReset();
        toast({ title: 'Anonymization Reset', description: 'Original report data has been restored.' });
    };

    return (
        <div className="bg-[#1E293B] p-4 rounded-lg border border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center"><UserX className="w-5 h-5 mr-2" /> Data Anonymization</h3>
                <Switch id="anonymization-toggle" checked={enabled} onCheckedChange={setEnabled} />
            </div>
            {enabled && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Select fields to anonymize in the report. This action will be logged.</p>
                    <div className="grid grid-cols-2 gap-2">
                        {ANONYMIZATION_FIELDS.map(field => (
                            <div key={field.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={field.id}
                                    checked={selectedFields.includes(field.id)}
                                    onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                                />
                                <Label htmlFor={field.id} className="text-gray-300 font-normal">{field.label}</Label>
                            </div>
                        ))}
                    </div>
                     <div className="flex justify-end gap-2">
                         {isAnonymized && <Button variant="outline" size="sm" onClick={handleReset}>Reset Anonymization</Button>}
                        <Button size="sm" onClick={handleApply} className="bg-[#BFFF00] text-black hover:bg-lime-400">
                           <ShieldCheck className="w-4 h-4 mr-2" /> Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataAnonymizationPanel;