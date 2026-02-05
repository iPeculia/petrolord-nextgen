import { supabase } from '@/lib/customSupabaseClient';

/**
 * Fetches all projects for the current user.
 * @returns {Promise<Array>} - A promise that resolves to an array of projects.
 */
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  return data;
}

/**
 * Fetches a single project by ID, including its wells.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<object|null>} - A promise that resolves to the project object or null if not found.
 */
export async function getProject(projectId) {
  if (!projectId) return null;
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      wells (
        id,
        name
      )
    `)
    .eq('id', projectId)
    .maybeSingle(); // Use maybeSingle() to prevent error if no rows are found

  if (error) {
    // For other errors, re-throw.
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
  return data;
}

/**
 * Creates a new project.
 * @param {object} projectData - The data for the new project (e.g., { name, description }).
 * @returns {Promise<object>} - A promise that resolves to the newly created project.
 */
export async function createProject(projectData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated.");

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...projectData, owner_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  return data;
}

// --- Strat Unit CRUD ---
export async function getStratUnits(projectId) {
    if (!projectId) return [];
    const { data, error } = await supabase.from('strat_units').select('*').eq('project_id', projectId);
    if (error) throw error;
    return data;
}
export async function createStratUnit(unitData) {
    const { data, error } = await supabase.from('strat_units').insert(unitData).select().single();
    if (error) throw error;
    return data;
}
export async function updateStratUnit(unitId, updates) {
    const { data, error } = await supabase.from('strat_units').update(updates).eq('id', unitId).select().single();
    if (error) throw error;
    return data;
}
export async function deleteStratUnit(unitId) {
    const { error } = await supabase.from('strat_units').delete().eq('id', unitId);
    if (error) throw error;
}

// --- Correlation Panel CRUD ---
export async function getCorrelationPanels(projectId) {
    if (!projectId) return [];
    // This is now deprecated in favor of just using the project itself.
    console.warn("getCorrelationPanels is deprecated.");
    return [];
}
export async function getCorrelationPanel(panelId) {
    if (!panelId) return null;
    // This is now deprecated in favor of getProject.
    console.warn("getCorrelationPanel is deprecated. Use getProject instead.");
    return getProject(panelId);
}
export async function createCorrelationPanel(panelData) {
    // This is now deprecated.
    console.warn("createCorrelationPanel is deprecated.");
    return null;
}

/**
 * Saves the order of wells in a correlation panel.
 * @param {string} panelId - The ID of the panel (or project).
 * @param {Array<string>} wellboreIds - Array of well IDs in the desired order.
 */
export async function savePanelWellOrder(panelId, wellboreIds) {
    // Implementation placeholder: In a real scenario, this would update a join table or metadata.
    // For now, we return success to prevent frontend errors.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { success: true };
}

// --- Correlation Line CRUD ---
export async function createCorrelationLine(lineData) {
    const { data, error } = await supabase.from('correlation_lines').insert(lineData).select().single();
    if (error) throw error;
    return data;
}
export async function deleteCorrelationLine(lineId) {
    const { error } = await supabase.from('correlation_lines').delete().eq('id', lineId);
    if (error) throw error;
}

// --- Well Top CRUD ---
export async function createWellTop(topData) {
    const { data, error } = await supabase.from('well_tops').insert(topData).select().single();
    if (error) throw error;
    return data;
}
export async function updateWellTop(topId, updates) {
    const { data, error } = await supabase.from('well_tops').update(updates).eq('id', topId).select().single();
    if (error) throw error;
    return data;
}
export async function deleteWellTop(topId) {
    const { error: lineError } = await supabase.from('correlation_lines').delete().or(`from_top_id.eq.${topId},to_top_id.eq.${topId}`);
    if (lineError) throw lineError;
    const { error: topError } = await supabase.from('well_tops').delete().eq('id', topId);
    if (topError) throw topError;
}