import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, UserCheck, AlertTriangle, Calendar } from 'lucide-react';
import useLicenseStatus from '@/hooks/useLicenseStatus';

/**
 * Component for Admins to manage user licenses.
 * Allows issuing, renewing, and revoking licenses.
 * 
 * Usage:
 * <LicenseManager targetUserId={selectedStudentId} onUpdate={refreshList} />
 */
const LicenseManager = ({ targetUserId, onUpdate }) => {
  const { toast } = useToast();
  const { status, refresh } = useLicenseStatus(targetUserId);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('renew'); // renew, revoke
  const [durationMonths, setDurationMonths] = useState(12);

  const handleUpdateLicense = async () => {
    if (!targetUserId) return;
    setLoading(true);

    try {
      let updateData = {};
      const now = new Date();

      if (actionType === 'renew') {
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + parseInt(durationMonths));
        
        updateData = {
          status: 'active',
          license_start: now.toISOString(),
          license_end: newEndDate.toISOString(),
          enrollment_status: 'enrolled',
          grace_period_end_date: null // clear old grace periods
        };
      } else if (actionType === 'revoke') {
        updateData = {
          status: 'revoked',
          enrollment_status: 'withdrawn',
          license_end: now.toISOString() // End immediately
        };
      } else if (actionType === 'extend_grace') {
         // Extend grace period by 30 days from now
         const graceEnd = new Date();
         graceEnd.setDate(graceEnd.getDate() + 30);
         updateData = {
           status: 'active', // Technically still active/grace
           grace_period_end_date: graceEnd.toISOString()
         };
      }

      const { error } = await supabase
        .from('university_members')
        .update(updateData)
        .eq('user_id', targetUserId);

      if (error) throw error;

      toast({
        title: "License Updated",
        description: `Successfully ${actionType === 'renew' ? 'renewed' : 'updated'} license for user.`,
        variant: "default",
      });

      refresh();
      if (onUpdate) onUpdate();

    } catch (err) {
      console.error('Error updating license:', err);
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!targetUserId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-500" />
          License Administration
        </CardTitle>
        <CardDescription>Manage access rights and license duration for this user.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Status Summary (Small) */}
        {status && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex items-center justify-between text-sm">
             <span className="text-gray-500">Current Status:</span>
             <span className={`font-bold px-2 py-0.5 rounded capitalize ${
               status.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
               {status.status}
             </span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renew">Renew / Issue License</SelectItem>
                <SelectItem value="revoke">Revoke License</SelectItem>
                <SelectItem value="extend_grace">Extend Grace Period (30 Days)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {actionType === 'renew' && (
            <div className="space-y-2">
              <Label>Duration (Months)</Label>
              <Select value={String(durationMonths)} onValueChange={(v) => setDurationMonths(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months (Semester)</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">1 Year</SelectItem>
                  <SelectItem value="24">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {actionType === 'revoke' && (
            <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-md flex gap-3 text-red-600 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>This will immediately revoke access to all modules and courses. The user will not be able to log in to protected areas.</p>
            </div>
          )}

          <Button 
            className="w-full mt-2" 
            variant={actionType === 'revoke' ? 'destructive' : 'default'}
            onClick={handleUpdateLicense}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              actionType === 'revoke' ? 'Revoke Access' : 'Update License'
            )}
            {loading ? 'Processing...' : ''}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseManager;