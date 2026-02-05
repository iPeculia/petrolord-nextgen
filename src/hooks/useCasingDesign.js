import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDesigns = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('casing_tubing_designs')
        .select(`
          *,
          wells (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error fetching designs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load casing designs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return { designs, loading, refetch: fetchDesigns };
};

export const useDesignDetails = (designId) => {
  const [design, setDesign] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDesignDetails = useCallback(async () => {
    if (!user || !designId) return;
    try {
      setLoading(true);
      
      // Fetch design metadata
      const { data: designData, error: designError } = await supabase
        .from('casing_tubing_designs')
        .select(`
          *,
          wells (
            name
          )
        `)
        .eq('id', designId)
        .single();

      if (designError) throw designError;
      setDesign(designData);

      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('design_sections')
        .select('*')
        .eq('design_id', designId)
        .order('sequence_order', { ascending: true });

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);

    } catch (error) {
      console.error('Error fetching design details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load design details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, designId, toast]);

  useEffect(() => {
    fetchDesignDetails();
  }, [fetchDesignDetails]);

  return { design, sections, loading, refetch: fetchDesignDetails };
};

export const useWells = () => {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWells = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('wells')
          .select('id, name, project_id')
          .order('name');
        
        if (error) throw error;
        setWells(data || []);
      } catch (error) {
        console.error('Error fetching wells:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWells();
  }, [user]);

  return { wells, loading };
};

export const useCasingOperations = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const createDesign = async (designData) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('casing_tubing_designs')
        .insert([{ ...designData, created_by: user.id }])
        .select('*') 
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Design created successfully.',
      });
      return data;
    } catch (error) {
      console.error('Error creating design:', error);
      toast({
        title: 'Error',
        description: 'Failed to create design.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const saveFullDesign = async (designData, sections, isEdit = false, originalSections = []) => {
      if (!user) {
          console.error("saveFullDesign: No user authenticated");
          return;
      }
      
      try {
          // --- 1. DATA VALIDATION & REPAIR ---
          let safeDesignData = { ...designData };

          // Check for project_id. If missing, try to fetch it from the well.
          if (!safeDesignData.project_id && safeDesignData.well_id) {
              const { data: wellData, error: wellError } = await supabase
                  .from('wells')
                  .select('project_id')
                  .eq('id', safeDesignData.well_id)
                  .single();
              
              if (wellError || !wellData) {
                  throw new Error("Could not determine Project ID from the selected Well.");
              }
              
              if (wellData.project_id) {
                  safeDesignData.project_id = wellData.project_id;
              } else {
                  throw new Error("The selected Well does not belong to any Project.");
              }
          }

          if (!safeDesignData.project_id) {
             throw new Error("Project ID is required but could not be found.");
          }

          safeDesignData.od = Number(safeDesignData.od);
          if (isNaN(safeDesignData.od)) throw new Error("Invalid OD value");

          let designId = safeDesignData.id;

          // --- 2. UPSERT DESIGN HEADER ---
          if (isEdit) {
               const { error: updateError } = await supabase
                  .from('casing_tubing_designs')
                  .update({
                      name: safeDesignData.name,
                      type: safeDesignData.type,
                      od: safeDesignData.od,
                      well_id: safeDesignData.well_id,
                      project_id: safeDesignData.project_id
                  })
                  .eq('id', designId);
               
               if (updateError) throw updateError;
          } else {
               const { data: newDesign, error: insertError } = await supabase
                  .from('casing_tubing_designs')
                  .insert([{
                      name: safeDesignData.name,
                      type: safeDesignData.type,
                      od: safeDesignData.od,
                      well_id: safeDesignData.well_id,
                      project_id: safeDesignData.project_id,
                      created_by: user.id
                  }])
                  .select('*') 
                  .single();
               
               if (insertError) throw insertError;
               designId = newDesign.id;
          }

          // --- 3. HANDLE SECTIONS (DIFFING) ---
          const currentIds = sections.map(s => s.id).filter(id => id && !id.toString().startsWith('temp-'));
          const originalIds = originalSections.map(s => s.id);
          
          const toDelete = originalIds.filter(id => !currentIds.includes(id));
          if (toDelete.length > 0) {
              await supabase.from('design_sections').delete().in('id', toDelete);
          }

          const toUpsert = sections.map((s, index) => ({
              design_id: designId,
              top_depth: Number(s.top_depth),
              bottom_depth: Number(s.bottom_depth),
              weight: Number(s.weight),
              grade: s.grade,
              connection_type: s.connection_type,
              burst_rating: Number(s.burst_rating),
              collapse_rating: Number(s.collapse_rating),
              tensile_strength: Number(s.tensile_strength),
              sequence_order: index + 1,
              ...(s.id && !s.id.toString().startsWith('temp-') ? { id: s.id } : {})
          }));

          if (toUpsert.length > 0) {
              const { error: sectionError } = await supabase
                  .from('design_sections')
                  .upsert(toUpsert)
                  .select('*'); 
              if (sectionError) throw sectionError;
          }

          toast({
              title: isEdit ? 'Design Updated' : 'Design Created',
              description: `Successfully ${isEdit ? 'updated' : 'created'} design "${safeDesignData.name}"`,
          });
          return designId;

      } catch (error) {
          console.error('saveFullDesign: Final Catch Error:', error);
          toast({
              title: 'Error',
              description: `Failed to ${isEdit ? 'update' : 'create'} design: ${error.message}`,
              variant: 'destructive',
          });
          throw error;
      }
  };

  const deleteDesign = async (id) => {
    try {
      await supabase.from('design_sections').delete().eq('design_id', id);

      const { error } = await supabase
        .from('casing_tubing_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Design deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting design:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete design.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const toggleDesignActive = async (designId, wellId, isActive) => {
    try {
        if (isActive) {
            // If setting to active, first deactivate all others for this well
            await supabase
                .from('casing_tubing_designs')
                .update({ is_active: false })
                .eq('well_id', wellId);
        }
        
        const { error } = await supabase
            .from('casing_tubing_designs')
            .update({ is_active: isActive })
            .eq('id', designId);

        if (error) throw error;

        toast({
            title: isActive ? 'Design Activated' : 'Design Deactivated',
            description: isActive ? 'This is now the active design for the well.' : 'Design is no longer active.',
        });
    } catch (error) {
        console.error('Error toggling active status:', error);
        toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
        throw error;
    }
  };

  return { createDesign, deleteDesign, saveFullDesign, toggleDesignActive };
};