import { supabase } from '@/lib/customSupabaseClient';
import { logAuditEvent, ACTIONS, LOG_TYPES } from '@/services/auditService';

export const AlumniService = {
  // Mark a student as alumni
  markAsAlumni: async (memberId, graduationDate) => {
    try {
      const gradDate = new Date(graduationDate);
      const gracePeriodEnd = new Date(gradDate);
      gracePeriodEnd.setDate(gradDate.getDate() + 60); // 60 days grace period

      const { data, error } = await supabase
        .from('university_members')
        .update({
          alumni_status: true,
          graduation_date: gradDate.toISOString(),
          grace_period_end_date: gracePeriodEnd.toISOString(),
          alumni_access_status: 'active', // Grace period starts as active
          enrollment_status: 'graduated'
        })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      await logAuditEvent({
        action: ACTIONS.USER_UPDATE,
        resourceType: 'user',
        resourceId: memberId,
        resourceName: data.name,
        details: { 
            event: 'marked_as_alumni', 
            graduationDate: gradDate.toISOString(), 
            gracePeriodEnd: gracePeriodEnd.toISOString() 
        },
        logType: LOG_TYPES.HISTORICAL
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error marking as alumni:', error);
      return { success: false, error };
    }
  },

  // Extend grace period
  extendGracePeriod: async (memberId, daysToAdd, reason, adminId) => {
    try {
      // First get current end date
      const { data: member, error: fetchError } = await supabase
        .from('university_members')
        .select('grace_period_end_date, name')
        .eq('id', memberId)
        .single();
      
      if (fetchError) throw fetchError;

      const currentEnd = new Date(member.grace_period_end_date || new Date());
      const newEnd = new Date(currentEnd);
      newEnd.setDate(newEnd.getDate() + parseInt(daysToAdd));

      // Update member
      const { error: updateError } = await supabase
        .from('university_members')
        .update({
          grace_period_end_date: newEnd.toISOString(),
          alumni_access_status: 'active' // Re-activate if it was expired
        })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Log extension
      const { error: logError } = await supabase
        .from('alumni_grace_period_extensions')
        .insert({
          university_member_id: memberId,
          extended_by: adminId,
          previous_end_date: currentEnd.toISOString(),
          new_end_date: newEnd.toISOString(),
          days_added: parseInt(daysToAdd),
          reason
        });

      if (logError) throw logError;

      await logAuditEvent({
        action: ACTIONS.LICENSE_CHANGE,
        resourceType: 'user',
        resourceId: memberId,
        resourceName: member.name,
        details: { 
            event: 'grace_period_extended', 
            daysAdded: daysToAdd, 
            newEndDate: newEnd.toISOString() 
        },
        logType: LOG_TYPES.HISTORICAL
      });

      return { success: true };
    } catch (error) {
      console.error('Error extending grace period:', error);
      return { success: false, error };
    }
  },

  // Revoke access (expire grace period immediately)
  revokeAccess: async (memberId) => {
    try {
      const { data, error } = await supabase
        .from('university_members')
        .update({
          alumni_access_status: 'expired',
          grace_period_end_date: new Date().toISOString() // Set to now
        })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      await logAuditEvent({
        action: ACTIONS.LICENSE_CHANGE,
        resourceType: 'user',
        resourceId: memberId,
        resourceName: data.name,
        details: { event: 'alumni_access_revoked' },
        logType: LOG_TYPES.HISTORICAL
      });

      return { success: true };
    } catch (error) {
      console.error('Error revoking access:', error);
      return { success: false, error };
    }
  },

  // Fetch alumni list for a university
  getAlumni: async (universityId) => {
    const { data, error } = await supabase
      .from('university_members')
      .select('*, university_departments(name)')
      .eq('university_id', universityId)
      .eq('alumni_status', true)
      .order('graduation_date', { ascending: false });

    if (error) throw error;
    return data;
  }
};