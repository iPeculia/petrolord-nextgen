import { supabase } from '@/lib/customSupabaseClient';

// --- Module Management ---

export const getModulesForAdmin = async () => {
  const { data, error } = await supabase
    .from('modules')
    .select('*, applications(count)')
    .order('name');
  if (error) throw error;
  return data.map(m => ({ ...m, app_count: m.applications[0]?.count || 0 }));
};

export const addModule = async (moduleData) => {
  const { data, error } = await supabase.from('modules').insert([moduleData]).select();
  if (error) throw error;
  return data[0];
};

export const updateModule = async (id, moduleData) => {
  const { data, error } = await supabase.from('modules').update(moduleData).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

// --- Application Management ---

export const getApplicationsForAdmin = async () => {
  const { data, error } = await supabase
    .from('applications')
    .select('*, modules(name)')
    .order('name');
  if (error) throw error;
  return data;
};

export const addApplication = async (appData) => {
  const { data, error } = await supabase.from('applications').insert([appData]).select();
  if (error) throw error;
  return data[0];
};

export const updateApplication = async (id, appData) => {
  const { data, error } = await supabase.from('applications').update(appData).eq('id', id).select();
  if (error) throw error;
  return data[0];
};


// --- Student Application Access Management ---

export const getAllStudentAccessRecords = async () => {
    const { data, error } = await supabase
        .from('student_application_access')
        .select(`
            id,
            student_id,
            profiles ( display_name, email ),
            application_id,
            applications ( name, modules ( name ) ),
            phase_unlocked,
            access_granted_date,
            access_expires_date,
            is_active
        `);

    if (error) throw error;
    return data;
};

export const grantApplicationAccess = async (accessData) => {
    const { student_id, application_id, phase_unlocked, access_expires_date } = accessData;

    const { data, error } = await supabase
        .from('student_application_access')
        .upsert({
            student_id,
            application_id,
            phase_unlocked,
            access_granted_date: new Date().toISOString(),
            access_expires_date,
            is_active: true
        }, { onConflict: 'student_id, application_id' })
        .select();

    if (error) throw error;
    return data[0];
};

export const revokeApplicationAccess = async (accessId) => {
    const { data, error } = await supabase
        .from('student_application_access')
        .update({ is_active: false })
        .eq('id', accessId)
        .select();

    if (error) throw error;
    return data[0];
};

export const getStudentsForSelect = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .eq('role', 'student')
        .order('display_name');
    if (error) throw error;
    return data;
}

export const getApplicationsForSelect = async () => {
    const { data, error } = await supabase
        .from('applications')
        .select('id, name')
        .order('name');
    if (error) throw error;
    return data;
}