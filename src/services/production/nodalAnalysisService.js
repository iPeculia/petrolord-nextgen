import { supabase } from '@/lib/supabaseClient';

// --- Session Management ---

export const createNodalSession = async ({ user_id, name, description, project_id }) => {
  const { data, error } = await supabase
    .from('nodal_analysis_sessions')
    .insert([
      { 
        user_id, 
        name, 
        description, 
        project_id,
        updated_at: new Date()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getNodalSessions = async (user_id) => {
  if (!user_id) return [];
  
  const { data, error } = await supabase
    .from('nodal_analysis_sessions')
    .select('*')
    .eq('user_id', user_id)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getNodalSessionById = async (sessionId) => {
  // CRITICAL FIX: Do not attempt query if sessionId is null or undefined
  if (!sessionId) return null;

  const { data, error } = await supabase
    .from('nodal_analysis_sessions')
    .select(`
      *,
      nodal_well_data(*),
      nodal_equipment_data(*),
      nodal_fluid_properties(*),
      nodal_calculation_params(*),
      nodal_analysis_results(*)
    `)
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
};

// --- Data Management (Upsert Patterns) ---

export const upsertWellData = async (wellData) => {
  const { session_id } = wellData;
  if (!session_id) throw new Error("Session ID required for well data");

  // Check if exists first to decide insert vs update, or use upsert
  const { data, error } = await supabase
    .from('nodal_well_data')
    .upsert(
      { 
        session_id,
        name: wellData.name,
        location: wellData.location,
        depth_tvd: wellData.depth_tvd,
        depth_md: wellData.depth_md,
        wellhead_pressure: wellData.wellhead_pressure,
        bottomhole_temp: wellData.bottomhole_temp,
        fluid_type: wellData.fluid_type,
        updated_at: new Date()
      }, 
      { onConflict: 'session_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertEquipmentData = async (equipmentData) => {
  const { session_id } = equipmentData;
  if (!session_id) throw new Error("Session ID required for equipment data");

  const { data, error } = await supabase
    .from('nodal_equipment_data')
    .upsert(
      { 
        session_id,
        tubing_od: equipmentData.tubing_od,
        tubing_id: equipmentData.tubing_id,
        tubing_roughness: equipmentData.tubing_roughness,
        tubing_length: equipmentData.tubing_length,
        casing_od: equipmentData.casing_od,
        casing_id: equipmentData.casing_id,
        choke_diameter: equipmentData.choke_diameter,
        separator_pressure: equipmentData.separator_pressure,
        updated_at: new Date()
      },
      { onConflict: 'session_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertFluidProperties = async (fluidData) => {
  const { session_id } = fluidData;
  if (!session_id) throw new Error("Session ID required for fluid data");

  const { data, error } = await supabase
    .from('nodal_fluid_properties')
    .upsert(
      {
        session_id,
        oil_gravity_api: fluidData.oil_gravity_api,
        gas_gravity: fluidData.gas_gravity,
        water_cut: fluidData.water_cut,
        gor: fluidData.gor,
        viscosity: fluidData.viscosity,
        density: fluidData.density,
        updated_at: new Date()
      },
      { onConflict: 'session_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertCalculationParams = async (params) => {
  const { session_id } = params;
  if (!session_id) throw new Error("Session ID required for params");

  const { data, error } = await supabase
    .from('nodal_calculation_params')
    .upsert(
      {
        session_id,
        flow_rate: params.flow_rate, // Initial guess or constraint
        pressure_drop_tubing: params.pressure_drop_tubing,
        pressure_drop_choke: params.pressure_drop_choke,
        friction_factor: params.friction_factor,
        temp_gradient: params.temp_gradient,
        updated_at: new Date()
      },
      { onConflict: 'session_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const saveResults = async (sessionId, results) => {
   if (!sessionId) throw new Error("Session ID required for results");

   const { data, error } = await supabase
    .from('nodal_analysis_results')
    .insert({
        session_id: sessionId,
        ...results,
        created_at: new Date()
    })
    .select()
    .single();

   if (error) throw error;
   return data;
};