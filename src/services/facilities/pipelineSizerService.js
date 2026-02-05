import { supabase } from '@/lib/customSupabaseClient';

export const pipelineSizerService = {
  // --- Cases ---
  async getCases(userId) {
    const { data, error } = await supabase
      .from('pipeline_sizer_cases')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCase(id) {
    const { data, error } = await supabase
      .from('pipeline_sizer_cases')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async saveCase(userId, caseData, id = null) {
    const payload = {
      user_id: userId,
      case_name: caseData.meta?.caseName || 'Untitled Case',
      case_description: caseData.meta?.description || '',
      case_data: caseData,
      updated_at: new Date().toISOString()
    };

    let result;
    if (id) {
      // Update
      const { data, error } = await supabase
        .from('pipeline_sizer_cases')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      result = data;
      
      await this.logAudit(id, userId, 'updated', { diff: 'Case updated' });
    } else {
      // Create
      const { data, error } = await supabase
        .from('pipeline_sizer_cases')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      result = data;

      await this.logAudit(result.id, userId, 'created', { initial: 'Case created' });
    }
    return result;
  },

  async deleteCase(id, userId) {
    // Log before delete (best effort)
    await this.logAudit(id, userId, 'deleted', {});
    
    const { error } = await supabase
      .from('pipeline_sizer_cases')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // --- Reports ---
  async saveReportRecord(caseId, userId, type, filePath, snapshot) {
    const { data, error } = await supabase
      .from('pipeline_sizer_reports')
      .insert([{
        case_id: caseId,
        report_type: type,
        file_path: filePath,
        generated_by: userId,
        version_snapshot: snapshot
      }])
      .select()
      .single();

    if (error) throw error;
    await this.logAudit(caseId, userId, 'exported', { type, file: filePath });
    return data;
  },

  async getReports(caseId) {
    const { data, error } = await supabase
      .from('pipeline_sizer_reports')
      .select('*')
      .eq('case_id', caseId)
      .order('generated_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async getDownloadUrl(filePath) {
    const { data, error } = await supabase.storage
      .from('reports') // Assuming a 'reports' bucket exists or will be created
      .createSignedUrl(filePath, 3600);
      
    if (error) throw error;
    return data.signedUrl;
  },

  // --- Audit ---
  async logAudit(caseId, userId, action, changes) {
    const { error } = await supabase
      .from('pipeline_sizer_audit_log')
      .insert([{
        case_id: caseId,
        user_id: userId,
        action,
        changes
      }]);
      
    if (error) console.error('Audit Log Error:', error);
  },

  async getAuditLog(caseId) {
    const { data, error } = await supabase
      .from('pipeline_sizer_audit_log')
      .select('*, profiles:user_id(display_name, email)') // Assuming profile relation exists or use user_id
      .eq('case_id', caseId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};