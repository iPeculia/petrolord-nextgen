import { supabase } from '@/lib/customSupabaseClient.js';

export const createProject = async (name, description) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('projects')
    .insert({ name, description, owner_id: user.id })
    .select()
    .single();
  
  if (error) throw error;
  
  // Add creator as admin member automatically
  await supabase.from('project_members').insert({
      project_id: data.id,
      user_id: user.id,
      role: 'admin'
  });

  return data;
};

export const getProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    // Get projects owned or where user is a member
    const { data, error } = await supabase
        .from('projects')
        .select(`*, project_members!inner(user_id)`)
        .eq('project_members.user_id', user.id);
    
    // Fallback if the inner join approach is too strict or tricky with RLS:
    // The 'projects' RLS now allows selecting if owner OR member.
    // So a simple select should work if RLS is set up correctly, 
    // but let's use the RLS-friendly fetch:
    
    const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (projError) throw projError;
    return projects;
};

export const getProjectMembers = async (projectId) => {
    const { data, error } = await supabase
        .from('project_members')
        .select(`
            *,
            profiles:user_id ( display_name, email )
        `)
        .eq('project_id', projectId);
        
    if (error) throw error;
    return data;
};

export const getProjectInvites = async (projectId) => {
    const { data, error } = await supabase
        .from('project_invites')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'pending');

    if (error) throw error;
    return data;
};

export const inviteMember = async (projectId, email, role = 'viewer') => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('project_invites')
        .insert({
            project_id: projectId,
            email,
            role,
            invited_by: user.id,
            status: 'pending'
        })
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

export const getProjectComments = async (projectId) => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            id, 
            content, 
            created_at, 
            user_id,
            profiles:user_id ( display_name, email )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
    if (error) throw error;
    return data;
};

export const addComment = async (projectId, content, analysisId = null) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('comments')
        .insert({
            project_id: projectId,
            analysis_id: analysisId,
            user_id: user.id,
            content
        })
        .select(`*, profiles:user_id(display_name)`)
        .single();

    if (error) throw error;
    return data;
};

export const saveVersion = async (analysisId, data, results, note) => {
     const { data: { user } } = await supabase.auth.getUser();
     
     const { count } = await supabase
        .from('analysis_versions')
        .select('id', { count: 'exact', head: true })
        .eq('analysis_id', analysisId);

     const { data: version, error } = await supabase
        .from('analysis_versions')
        .insert({
            analysis_id: analysisId,
            data,
            results,
            note,
            version_number: (count || 0) + 1,
            created_by: user.id
        })
        .select()
        .single();

    if (error) throw error;
    return version;
};

export const getVersions = async (analysisId) => {
    const { data, error } = await supabase
        .from('analysis_versions')
        .select('*')
        .eq('analysis_id', analysisId)
        .order('version_number', { ascending: false });

    if (error) throw error;
    return data;
};