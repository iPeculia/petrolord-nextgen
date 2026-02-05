import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const REPORT_TYPES = ['system_activity', 'user_activity', 'data_change', 'security_event', 'user_enrollment', 'certificate', 'email', 'failure'];
const FREQUENCIES = ['daily', 'weekly', 'monthly'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

const ScheduledReportForm = ({ onSave, onCancel, report, loading }) => {
    const { toast } = useToast();
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        defaultValues: report || {
            title: '',
            description: '',
            report_type: 'system_activity',
            frequency: 'daily',
            time_of_day: '09:00',
            email_recipients: [],
            enabled: true,
        },
    });

    const frequency = watch('frequency');

    const onSubmit = (data) => {
        // Convert comma-separated emails to array
        if (typeof data.email_recipients === 'string') {
            data.email_recipients = data.email_recipients.split(',').map(e => e.trim()).filter(Boolean);
        }
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label>Title</label>
                <Input {...register('title', { required: 'Title is required' })} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
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
            <div>
                <label>Frequency</label>
                 <Controller
                    name="frequency"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                />
            </div>

            {frequency === 'weekly' && (
                <div>
                    <label>Day of the Week</label>
                    <Controller
                        name="day_of_week"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{DAYS_OF_WEEK.map((day, i) => <SelectItem key={i} value={String(i)}>{day}</SelectItem>)}</SelectContent>
                            </Select>
                        )}
                    />
                </div>
            )}
            {frequency === 'monthly' && (
                 <div>
                    <label>Day of the Month</label>
                    <Controller
                        name="day_of_month"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{DAYS_OF_MONTH.map(day => <SelectItem key={day} value={String(day)}>{day}</SelectItem>)}</SelectContent>
                            </Select>
                        )}
                    />
                </div>
            )}

            <div>
                <label>Time of Day (HH:MM)</label>
                <Input type="time" {...register('time_of_day', { required: 'Time is required' })} />
                 {errors.time_of_day && <p className="text-red-500 text-sm mt-1">{errors.time_of_day.message}</p>}
            </div>
             <div>
                <label>Email Recipients (comma-separated)</label>
                <Input {...register('email_recipients', { required: 'At least one recipient is required' })} defaultValue={report?.email_recipients?.join(', ')} />
                 {errors.email_recipients && <p className="text-red-500 text-sm mt-1">{errors.email_recipients.message}</p>}
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-[#BFFF00] text-black hover:bg-lime-400">{loading ? 'Saving...' : 'Save Schedule'}</Button>
            </div>
        </form>
    );
};

export default ScheduledReportForm;