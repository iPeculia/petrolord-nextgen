import { supabase } from '@/lib/customSupabaseClient';

export const projectService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getProjectDetails(projectId) {
    const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select(`*, user:user_id ( id, email, display_name )`)
        .eq('project_id', projectId);
    
    if (membersError) throw membersError;

    const { data: metadata, error: metadataError } = await supabase
        .from('project_metadata')
        .select('*')
        .eq('project_id', projectId);
    
    if (metadataError) throw metadataError;

    return { members, metadata };
  },
  
  async createProject(projectData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert({ 
          ...projectData, 
          owner_id: user.id, 
          created_by: user.id,
          updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Add owner as member
    await supabase.from('project_members').insert({
        project_id: data.id,
        user_id: user.id,
        role: 'owner'
    });
    
    return data;
  },

  async updateProject(id, updates) {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
  },

  async deleteProject(id) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
  },

  async addMember(projectId, email, role) {
      // 1. Find user by email (simplified, usually requires admin function or public profiles)
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userProfile) throw new Error("User not found with that email.");

      const { error } = await supabase
        .from('project_members')
        .insert({ project_id: projectId, user_id: userProfile.id, role });

      if (error) throw error;
  },

  async removeMember(projectId, userId) {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .match({ project_id: projectId, user_id: userId });
      if (error) throw error;
  },

  async updateMemberRole(projectId, userId, role) {
      const { error } = await supabase
        .from('project_members')
        .update({ role })
        .match({ project_id: projectId, user_id: userId });
      if (error) throw error;
  },

  async setMetadata(projectId, key, value) {
      const { data, error } = await supabase
        .from('project_metadata')
        .upsert({ project_id: projectId, key, value }, { onConflict: 'project_id,key' })
        .select()
        .single();
      if (error) throw error;
      return data;
  },

  async deleteMetadata(projectId, key) {
      const { error } = await supabase
        .from('project_metadata')
        .delete()
        .match({ project_id: projectId, key });
      if (error) throw error;
  }
};