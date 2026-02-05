import { supabase } from '@/lib/customSupabaseClient';

class IRRAnalysisService {
  // --- Projects ---
  async getAllProjects() {
    const { data, error } = await supabase
      .from('irr_projects')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getProject(projectId) {
    const { data, error } = await supabase
      .from('irr_projects')
      .select('*')
      .eq('project_id', projectId)
      .single();
    if (error) throw error;
    return data;
  }

  async createProject(projectData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('irr_projects')
      .insert([{ ...projectData, user_id: user.id }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProject(projectId, updates) {
    const { data, error } = await supabase
      .from('irr_projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('project_id', projectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteProject(projectId) {
    const { error } = await supabase
      .from('irr_projects')
      .delete()
      .eq('project_id', projectId);
    if (error) throw error;
    return true;
  }

  // --- Financial Parameters ---
  async getFinancialParameters(projectId) {
    const { data, error } = await supabase
      .from('irr_financial_params')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle(); // Returns null if not found instead of error
    if (error) throw error;
    return data;
  }

  async upsertFinancialParameters(params) {
    const { data, error } = await supabase
      .from('irr_financial_params')
      .upsert(params, { onConflict: 'project_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // --- Cost Structure ---
  async getCostStructure(projectId) {
    const { data: structure, error: structError } = await supabase
      .from('irr_cost_structures')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();
      
    if (structError) throw structError;
    if (!structure) return null;

    // Fetch related schedules
    const { data: capex } = await supabase
      .from('irr_capex_schedule')
      .select('*')
      .eq('cost_structure_id', structure.cost_structure_id)
      .order('year', { ascending: true });

    const { data: opex } = await supabase
      .from('irr_opex_schedule')
      .select('*')
      .eq('cost_structure_id', structure.cost_structure_id)
      .order('year', { ascending: true });

    return {
      ...structure,
      capex_schedule: capex || [],
      opex_schedule: opex || []
    };
  }

  async createCostStructure(structureData) {
    const { data, error } = await supabase
      .from('irr_cost_structures')
      .insert([structureData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  
  async updateCostStructure(projectId, updates) {
    const { data, error } = await supabase
      .from('irr_cost_structures')
      .update(updates)
      .eq('project_id', projectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async addCapexItem(item) {
    const { data, error } = await supabase
      .from('irr_capex_schedule')
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async removeCapexItem(itemId) {
    const { error } = await supabase
      .from('irr_capex_schedule')
      .delete()
      .eq('capex_schedule_id', itemId);
    if (error) throw error;
    return true;
  }

  async addOpexItem(item) {
    const { data, error } = await supabase
      .from('irr_opex_schedule')
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async removeOpexItem(itemId) {
    const { error } = await supabase
      .from('irr_opex_schedule')
      .delete()
      .eq('opex_schedule_id', itemId);
    if (error) throw error;
    return true;
  }

  // --- Revenue ---
  async getRevenue(projectId) {
    const { data: revenue, error: revError } = await supabase
      .from('irr_revenues')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    if (revError) throw revError;
    if (!revenue) return null;

    const { data: prod } = await supabase
      .from('irr_production_schedule')
      .select('*')
      .eq('revenue_id', revenue.revenue_id)
      .order('year', { ascending: true });

    return {
      ...revenue,
      production_schedule: prod || []
    };
  }

  async upsertRevenue(revenueData) {
     const { data, error } = await supabase
      .from('irr_revenues')
      .upsert(revenueData, { onConflict: 'project_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async addProductionItem(item) {
    const { data, error } = await supabase
      .from('irr_production_schedule')
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async removeProductionItem(itemId) {
    const { error } = await supabase
      .from('irr_production_schedule')
      .delete()
      .eq('production_schedule_id', itemId);
    if (error) throw error;
    return true;
  }

  // --- Cashflows ---
  async getCashflows(projectId) {
    const { data, error } = await supabase
      .from('irr_cashflows')
      .select('*')
      .eq('project_id', projectId)
      .order('year', { ascending: true });
    if (error) throw error;
    return data;
  }

  async saveCashflows(cashflows) {
    // Delete existing and insert new for full overwrite logic usually simplest for derived data
    if (!cashflows.length) return;
    
    // This is a bulk operation pattern
    const projectId = cashflows[0].project_id;
    
    // Transaction-like approach best handled by Edge Function in prod, but here client-side:
    await supabase.from('irr_cashflows').delete().eq('project_id', projectId);
    
    const { data, error } = await supabase
      .from('irr_cashflows')
      .insert(cashflows)
      .select();
    if (error) throw error;
    return data;
  }

  // --- Results ---
  async getAnalysisResults(projectId) {
     const { data, error } = await supabase
      .from('irr_analysis_results')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async saveAnalysisResult(result) {
    const { data, error } = await supabase
      .from('irr_analysis_results')
      .insert([result])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export const irrAnalysisService = new IRRAnalysisService();