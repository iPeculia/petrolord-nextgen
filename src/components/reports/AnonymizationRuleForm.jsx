import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { createAnonymizationRule, updateAnonymizationRule } from '@/lib/customAnonymizationUtils';

const FIELD_TYPES = ['email', 'phone', 'name', 'address', 'ssn', 'credit_card', 'ip_address', 'custom'];
const RULE_TYPES = ['mask', 'replace', 'regex', 'hash'];

const AnonymizationRuleForm = ({ isOpen, onClose, onSave, rule }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm();
    const ruleType = watch('rule_type');

    useEffect(() => {
        if (rule) {
            reset(rule);
        } else {
            reset({
                name: '',
                description: '',
                field_name: '',
                field_type: 'custom',
                rule_type: 'mask',
                is_active: true,
                is_public: false,
            });
        }
    }, [rule, reset]);

    const onSubmit = async (data) => {
        try {
            if (rule) {
                await updateAnonymizationRule(rule.id, data);
                toast({ title: 'Success', description: 'Rule updated successfully.' });
            } else {
                await createAnonymizationRule(data, user.id);
                toast({ title: 'Success', description: 'Rule created successfully.' });
            }
            onSave();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1E293B] border-gray-700 text-white sm:max-w-[600px]">
                <DialogHeader><DialogTitle>{rule ? 'Edit' : 'Create'} Anonymization Rule</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div><Label>Name</Label><Input {...register('name', { required: true })} />{errors.name && <span className="text-red-500 text-sm">This field is required.</span>}</div>
                    <div><Label>Field Name</Label><Input {...register('field_name', { required: true })} />{errors.field_name && <span className="text-red-500 text-sm">This field is required.</span>}</div>
                    <div><Label>Field Type</Label><Controller name="field_type" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FIELD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>)} /></div>
                    <div><Label>Rule Type</Label><Controller name="rule_type" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{RULE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>)} /></div>
                    
                    {ruleType === 'mask' && (
                        <>
                            <div><Label>Mask Character</Label><Input {...register('mask_char')} defaultValue="*" /></div>
                            <div><Label>Visible Characters</Label><Input type="number" {...register('visible_chars', { valueAsNumber: true })} defaultValue={0} /></div>
                        </>
                    )}
                    {ruleType === 'replace' && (
                        <div><Label>Replacement Value</Label><Input {...register('replacement')} /></div>
                    )}
                     {ruleType === 'regex' && (
                        <>
                            <div><Label>Pattern (Regex)</Label><Input {...register('pattern')} /></div>
                             <div><Label>Replacement</Label><Input {...register('replacement')} /></div>
                        </>
                    )}
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-[#BFFF00] text-black hover:bg-lime-400">Save Rule</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AnonymizationRuleForm;