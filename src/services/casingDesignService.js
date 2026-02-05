import { supabase } from '@/lib/customSupabaseClient';

export const casingDesignService = {
  // --- Designs ---
  async getDesigns(projectId) {
    let query = supabase
      .from('casing_tubing_designs')
      .select(`
        *,
        wells ( name )
      `)
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getDesign(id) {
    const { data, error } = await supabase
      .from('casing_tubing_designs')
      .select(`
        *,
        wells ( name )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createDesign(designData) {
    console.log("[casingDesignService] createDesign called with:", designData);
    
    // 1. Validation
    if (!designData.project_id) {
        console.error("[casingDesignService] Missing project_id in payload");
        throw new Error("Project ID is required to create a design.");
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 2. Prepare Payload (ensure types)
    const payload = {
        name: designData.name,
        type: designData.type,
        od: Number(designData.od),
        well_id: designData.well_id,
        project_id: designData.project_id,
        created_by: user.id
    };

    console.log("[casingDesignService] Sending insert payload:", payload);

    // 3. Execute Insert
    const { data, error } = await supabase
      .from('casing_tubing_designs')
      .insert(payload)
      .select('*') // Explicit wildcard select
      .single();
    
    if (error) {
        console.error("[casingDesignService] Supabase INSERT Error:", error);
        // Throw a more descriptive error if possible
        throw new Error(`Database Insert Failed: ${error.message} (${error.details || error.hint || 'No details'})`);
    }

    console.log("[casingDesignService] Design created successfully:", data);
    return data;
  },

  async updateDesign(id, updates) {
    console.log("[casingDesignService] updateDesign called for:", id, updates);
    
    const { data, error } = await supabase
      .from('casing_tubing_designs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
        console.error("[casingDesignService] Supabase UPDATE Error:", error);
        throw error;
    }
    return data;
  },

  async deleteDesign(id) {
    const { error } = await supabase
      .from('casing_tubing_designs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Sections ---
  async getSections(designId) {
    const { data, error } = await supabase
      .from('design_sections')
      .select('*')
      .eq('design_id', designId)
      .order('sequence_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createSection(sectionData) {
    const { data, error } = await supabase
      .from('design_sections')
      .insert(sectionData)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async updateSection(id, updates) {
    const { data, error } = await supabase
      .from('design_sections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSection(id) {
    const { error } = await supabase
      .from('design_sections')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};