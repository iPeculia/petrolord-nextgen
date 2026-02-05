import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useStudentLicense = (userId) => {
  const [licenseInfo, setLicenseInfo] = useState({
    licenseEnd: null,
    daysRemaining: null,
    status: 'loading', // loading, active, warning, expired, grace_period_active, grace_period_expired
    assignedModule: null,
    isAlumni: false,
    graduationDate: null
  });

  useEffect(() => {
    if (!userId) return;

    const fetchLicenseData = async () => {
      try {
        const { data: memberData, error: memberError } = await supabase
          .from('university_members')
          .select('license_end, license_type, alumni_status, graduation_date, grace_period_end_date, alumni_access_status')
          .eq('user_id', userId)
          .maybeSingle();

        const { data: moduleData, error: moduleError } = await supabase
          .from('student_module_assignments')
          .select('core_module_id, modules(name)')
          .eq('student_id', userId)
          .maybeSingle();

        if (memberError) console.error('Error fetching license:', memberError);

        let newState = {
            licenseEnd: null,
            daysRemaining: null,
            status: 'unknown',
            assignedModule: moduleData?.modules?.name || null,
            isAlumni: false,
            graduationDate: null
        };

        if (memberData) {
            const now = new Date();

            if (memberData.alumni_status) {
                // Alumni Logic
                newState.isAlumni = true;
                newState.graduationDate = memberData.graduation_date;
                const graceEnd = new Date(memberData.grace_period_end_date);
                const diffTime = graceEnd - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                newState.licenseEnd = graceEnd;
                newState.daysRemaining = diffDays;

                if (diffDays <= 0 || memberData.alumni_access_status === 'expired') {
                    newState.status = 'grace_period_expired';
                    newState.daysRemaining = 0; // Don't show negative days
                } else {
                    newState.status = 'grace_period_active';
                }

            } else {
                // Regular Student Logic
                if (memberData.license_type === 'continuous') {
                    newState.status = 'active';
                    newState.daysRemaining = Infinity;
                } else if (memberData.license_end) {
                    const endDate = new Date(memberData.license_end);
                    const diffTime = endDate - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    newState.licenseEnd = endDate;
                    newState.daysRemaining = diffDays;
                    
                    if (diffDays <= 0) {
                        newState.status = 'expired';
                    } else if (diffDays <= 7) {
                        newState.status = 'warning';
                    } else {
                        newState.status = 'active';
                    }
                }
            }
        } else {
            // Not a university member (e.g. admin or regular user)
            newState.status = 'active';
            newState.daysRemaining = Infinity;
        }
        
        setLicenseInfo(newState);

      } catch (error) {
        console.error('Error in useStudentLicense:', error);
        setLicenseInfo(prev => ({ ...prev, status: 'error' }));
      }
    };

    fetchLicenseData();
  }, [userId]);

  return licenseInfo;
};