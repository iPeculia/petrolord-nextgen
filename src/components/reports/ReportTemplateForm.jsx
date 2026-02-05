import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const REPORT_TYPES = ['system_activity', 'user_activity', 'data_change', 'security_event', 'user_enrollment', 'certificate', 'email', 'failure'];

const ReportTemplateForm = ({ onSave, onCancel, template, loading }) => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: template || {
            name: '',
            description: '',
            report_type: 'system_activity',
            is_public: false,
        },
    });

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label>Template Name</label>
                <Input {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
             <div>
                <label>Description</label>
                <Input {...register('description')} />
            </div>
            <div>
                <label>Report Type</label>
                <Controller
                    name="report_type"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{REPORT_TYPES.map(type => <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-[#BFFF00] text-black hover:bg-lime-400">{loading ? 'Saving...' : 'Save Template'}</Button>
            </div>
        </form>
    );
};

export default ReportTemplateForm;