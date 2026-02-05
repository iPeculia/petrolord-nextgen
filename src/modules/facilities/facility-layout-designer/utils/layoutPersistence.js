import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useLayoutPersistence = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Helper to get or create a default layout
  const getOrCreateDefaultLayout = useCallback(async () => {
    try {
      // 1. Try to find an existing default layout
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: existingLayouts, error: fetchError } = await supabase
        .from('facility_layouts')
        .select('id')
        .eq('name', 'Default Layout')
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingLayouts && existingLayouts.length > 0) {
        return existingLayouts[0].id;
      }

      // 2. If not found, create one
      // We need a valid project ID.
      let projectId;
      const { data: projects } = await supabase.from('projects').select('id').eq('owner_id', user.id).limit(1);
      
      if (projects && projects.length > 0) {
        projectId = projects[0].id;
      } else {
        // Create a default project if none exists (safe fallback for empty accounts)
        const { data: newProject, error: projError } = await supabase
          .from('projects')
          .insert({
            name: 'Default Facility Project',
            description: 'Auto-generated for Facility Layout Designer',
            owner_id: user.id,
            type: 'Facilities',
            status: 'Active'
          })
          .select()
          .single();
          
        if (projError) throw projError;
        projectId = newProject.id;
      }

      const { data: newLayout, error: createError } = await supabase
        .from('facility_layouts')
        .insert({
          project_id: projectId,
          name: 'Default Layout',
          description: 'Default layout for designer',
          status: 'Draft',
          center_lat: 29.7604,
          center_lng: -95.3698,
          zoom_level: 16,
          created_by: user.id
        })
        .select()
        .single();

      if (createError) throw createError;
      return newLayout.id;

    } catch (error) {
      console.error('Error initializing default layout:', error);
      toast({
        title: 'Initialization Error',
        description: 'Could not load or create default layout. Please refresh.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const loadLayoutData = useCallback(async (layoutId) => {
    if (!layoutId) return null;
    setLoading(true);
    try {
      // 1. Get Equipment
      const { data: equipment, error: eqError } = await supabase
        .from('facility_equipment')
        .select('*')
        .eq('layout_id', layoutId);
      
      if (eqError) throw eqError;

      // 2. Get Lines
      const { data: lines, error: lnError } = await supabase
        .from('facility_lines')
        .select('*')
        .eq('layout_id', layoutId);

      if (lnError) throw lnError;

      // 3. Get Zones
      const { data: zones, error: znError } = await supabase
        .from('facility_zones')
        .select('*')
        .eq('layout_id', layoutId);

      if (znError) throw znError;

      return { equipment, lines, zones };
    } catch (error) {
      console.error('Error loading layout data:', error);
      toast({
        title: 'Error Loading Data',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * STRICT SCHEMA ENFORCEMENT for Equipment Insert
   * DB Schema: id, layout_id, tag, type, lat, lng, rotation, scale_x, scale_y, properties, validation_errors, created_at, category, model
   */
  const saveEquipment = async (item, layoutId) => {
    console.group('💾 Save Equipment Initiated');
    console.log('Incoming Item:', item);
    console.log('Target Layout ID:', layoutId);
    
    if (!layoutId) {
        console.error("❌ Save Equipment Error: No layout ID provided");
        toast({ title: 'System Error', description: 'Internal Error: Missing Layout ID.', variant: 'destructive' });
        console.groupEnd();
        return null;
    }

    if (!item || !item.tag || !item.type) {
         console.error("❌ Save Equipment Error: Missing required fields (tag/type)", item);
         toast({ title: 'Validation Error', description: 'Tag and Type are required fields.', variant: 'destructive' });
         console.groupEnd();
         return null;
    }

    try {
      // Validate coordinates
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error(`Invalid coordinates: lat=${item.lat}, lng=${item.lng}`);
      }

      // Consolidate non-schema fields into properties JSONB
      // This ensures we never send 'service' or 'status' as top-level columns which would cause PGRST errors
      const properties = {
          ...(item.properties || {}),
          service: item.properties?.service || item.service || '',
          capacity: item.properties?.capacity || item.capacity || '',
          pressure_rating: item.properties?.pressure_rating || item.pressure_rating || '',
          notes: item.properties?.notes || item.notes || '',
          status: item.status || item.properties?.status || 'Proposed'
      };

      // Construct Payload - STRICTLY defined columns only
      const payload = {
          id: item.id, // uuid
          layout_id: layoutId, // uuid
          tag: item.tag, // text
          type: item.type, // text
          lat: lat, // double precision
          lng: lng, // double precision
          rotation: item.rotation || 0, // double precision
          scale_x: item.scale_x || 1, // double precision
          scale_y: item.scale_y || 1, // double precision
          category: item.category || 'equipment', // text
          properties: properties, // jsonb
          model: item.model || null // text (optional)
          // validation_errors: null, // jsonb (optional)
      };

      console.log("📦 Payload prepared for Supabase:", payload);

      // We use .select() instead of .select().single() to avoid errors if RLS behaves unexpectedly
      // .select() returns an array, which is safer to handle.
      const { data, error } = await supabase
        .from('facility_equipment')
        .upsert(payload)
        .select();

      if (error) {
          console.error('❌ Supabase Upsert Error:', error);
          // Log detailed error info if available
          if (error.details) console.error('Error Details:', error.details);
          if (error.hint) console.error('Error Hint:', error.hint);
          throw error;
      }
      
      // Handle the array response safely
      const savedItem = Array.isArray(data) && data.length > 0 ? data[0] : (Array.isArray(data) ? null : data);
      
      if (!savedItem) {
          console.warn("⚠️ Warning: Data saved but no row returned. Check RLS policies.");
          // If no error was thrown, we can assume success but we return the payload as fallback so UI updates
          // Use original payload ID to ensure key consistency
          return payload;
      }

      console.log("✅ Equipment Saved Successfully (DB Response):", savedItem);
      console.groupEnd();
      return savedItem;
    } catch (error) {
      console.error('❌ Save Equipment Exception:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'Could not save equipment data. Check console for details.',
        variant: 'destructive'
      });
      console.groupEnd();
      return null;
    }
  };

  const saveLine = async (line, layoutId) => {
    if (!layoutId) return null;
    try {
      const { data, error } = await supabase
        .from('facility_lines')
        .upsert({
          id: line.id,
          layout_id: layoutId,
          line_id: line.line_id,
          from_tag: line.from_tag,
          to_tag: line.to_tag,
          from_nozzle: line.from_nozzle,
          to_nozzle: line.to_nozzle,
          flow_direction: line.flow_direction,
          points: line.points,
          properties: {
            size: line.properties?.size,
            spec: line.properties?.spec,
            fluid: line.properties?.fluid,
            ...line.properties
          },
          status: line.status || 'Proposed'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
       console.error('Error saving line:', error);
       toast({
        title: 'Save Failed',
        description: 'Could not save line data.',
        variant: 'destructive'
      });
       return null;
    }
  };

  const deleteItem = async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      toast({
        title: 'Delete Failed',
        description: 'Could not delete item.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    loading,
    getOrCreateDefaultLayout,
    loadLayoutData,
    saveEquipment,
    saveLine,
    deleteItem
  };
};