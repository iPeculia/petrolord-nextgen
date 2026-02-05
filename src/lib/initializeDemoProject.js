import { supabase } from './customSupabaseClient';

// A fixed ID for the demo project to ensure consistency across sessions
export const DEMO_PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export const initializeDemoProject = async () => {
  try {
    // FIX: Use maybeSingle() instead of single() to prevent PGRST116 error when row doesn't exist
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', DEMO_PROJECT_ID)
      .maybeSingle();

    if (fetchError) {
      console.warn('Error checking for demo project:', fetchError);
      return null;
    }

    if (existingProject) {
      return existingProject;
    }

    // If we reach here, we could optionally create it, but for now we just return null
    // to avoid permission errors if the user isn't allowed to insert specific IDs.
    return null;

  } catch (error) {
    console.warn('Unexpected error in initializeDemoProject:', error);
    return null;
  }
};