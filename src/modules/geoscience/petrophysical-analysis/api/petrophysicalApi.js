import { supabase } from '@/lib/customSupabaseClient.js';
import { exportAnalysis as exportUtil } from '@/modules/geoscience/petrophysical-analysis/utils/exportUtils.js';

// Create a new analysis entry
export const createAnalysis = async (wellId, name) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('petrophysical_analyses')
    .insert([{ user_id: user.id, well_id: wellId, name }])
    .select()
    .single();

  if (error) {
    console.error('Error creating analysis:', error);
    throw error;
  }
  return data;
};

// Save analysis data and results
export const saveAnalysis = async (analysisId, analysisData, analysisResults) => {
  // Save analysis data
  const { data: savedData, error: dataError } = await supabase
    .from('analysis_data')
    .upsert({ analysis_id: analysisId, ...analysisData }, { onConflict: 'analysis_id' })
    .select()
    .single();

  if (dataError) {
    console.error('Error saving analysis data:', dataError);
    throw dataError;
  }

  // Save analysis results
  const { data: savedResults, error: resultsError } = await supabase
    .from('analysis_results')
    .upsert({ analysis_id: analysisId, ...analysisResults }, { onConflict: 'analysis_id' })
    .select()
    .single();

  if (resultsError) {
    console.error('Error saving analysis results:', resultsError);
    throw resultsError;
  }

  // Update the timestamp on the main analysis entry
  const { error: updateError } = await supabase
    .from('petrophysical_analyses')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', analysisId);

  if (updateError) {
    console.error('Error updating analysis timestamp:', updateError);
    // Non-critical, so we don't throw
  }

  return { savedData, savedResults };
};

// Load a specific analysis with its data and results
export const loadAnalysis = async (analysisId) => {
  const { data, error } = await supabase
    .from('petrophysical_analyses')
    .select(`
      id,
      name,
      well_id,
      analysis_data ( id, depth_range, log_data, parameters ),
      analysis_results ( id, calculations, metadata )
    `)
    .eq('id', analysisId)
    .single();

  if (error) {
    console.error('Error loading analysis:', error);
    throw error;
  }
  return data;
};

// Delete an analysis and its related data
export const deleteAnalysis = async (analysisId) => {
  const { error } = await supabase
    .from('petrophysical_analyses')
    .delete()
    .eq('id', analysisId);

  if (error) {
    console.error('Error deleting analysis:', error);
    throw error;
  }
  return { success: true };
};

// List all analyses for the current user
export const listAnalyses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
    .from('petrophysical_analyses')
    .select('id, name, well_id, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error listing analyses:', error);
    throw error;
  }
  return data;
};

// Export analysis using the utility
export const exportAnalysis = async (analysisId, format) => {
  return await exportUtil(analysisId, format);
};