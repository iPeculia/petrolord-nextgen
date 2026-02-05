import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auditService } from '@/services/auditService';
import { useToast } from '@/components/ui/use-toast';
import { Archive, Save } from 'lucide-react';

const RetentionPolicies = () => {
    const { toast } = useToast();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadPolicies();
    }, []);

    const loadPolicies = async () => {
        try {
            const data = await auditService.getRetentionPolicies();
            setPolicies(data);
        } catch (error) {
            console.error("Failed to load policies", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePolicyChange = (id, field, value) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        setHasChanges(true);
    };

    const handleSave = async (policy) => {
        try {
            await auditService.updateRetentionPolicy(policy.id, {
                retention_days: policy.retention_days,
                auto_delete: policy.auto_delete
            });
            toast({ title: "Policy Saved", description: `Updated ${policy.policy_name}` });
        } catch (error) {
            toast({ variant: "destructive", title: "Save Failed", description: error.message });
        }
    };

    return (
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader>
                <CardTitle className="text-white flex items-center">
                    <Archive className="w-5 h-5 mr-2 text-[#BFFF00]" />
                    Data Retention Policies
                </CardTitle>
                <p className="text-sm text-slate-400">
                    Configure how long audit logs are kept before being automatically archived or deleted.
                </p>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-slate-900/50">
                        <TableRow className="border-slate-800">
                            <TableHead className="text-slate-400">Policy Name</TableHead>
                            <TableHead className="text-slate-400">Log Type</TableHead>
                            <TableHead className="text-slate-400">Retention (Days)</TableHead>
                            <TableHead className="text-slate-400">Auto Delete</TableHead>
                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {policies.map((policy) => (
                            <TableRow key={policy.id} className="border-slate-800">
                                <TableCell className="font-medium text-white">{policy.policy_name}</TableCell>
                                <TableCell className="text-slate-300 capitalize">{policy.log_type}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number" 
                                            className="w-24 bg-slate-950 border-slate-700 text-white"
                                            value={policy.retention_days}
                                            onChange={(e) => handlePolicyChange(policy.id, 'retention_days', parseInt(e.target.value))}
                                        />
                                        <span className="text-slate-500 text-sm">days</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Switch 
                                        checked={policy.auto_delete}
                                        onCheckedChange={(checked) => handlePolicyChange(policy.id, 'auto_delete', checked)}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        size="sm" 
                                        className="bg-slate-800 hover:bg-slate-700 text-white"
                                        onClick={() => handleSave(policy)}
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default RetentionPolicies;