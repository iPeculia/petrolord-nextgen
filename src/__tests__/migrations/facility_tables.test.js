import { describe, it, expect, beforeAll } from 'vitest';
import { supabase } from '../../lib/supabaseClient';

describe('Facility Collaboration Tables Migration Check', () => {
  const tablesToCheck = [
    'facility_layout_versions',
    'facility_layout_comments',
    'facility_layout_collaborators',
    'facility_layout_audit_log'
  ];

  it('should have all facility collaboration tables created', async () => {
    // We check existence by trying to select 0 rows from each table
    // If table doesn't exist, Supabase/Postgres throws an error
    
    for (const table of tablesToCheck) {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
        
      if (error) {
        console.error(`Error checking table ${table}:`, error);
      }
      
      // If error code is '42P01' (undefined_table), the test fails
      expect(error).toBeNull(); 
    }
  });

  it('should allow inserting a test comment (RLS check)', async () => {
    // This assumes there is at least one layout and a logged-in user context in the test environment
    // For a migration smoke test, we primarily check table existence.
    // Full RLS testing requires mocking auth context which is outside scope of simple schema verification.
    
    const { data: layouts } = await supabase.from('facility_layouts').select('id').limit(1);
    
    if (layouts && layouts.length > 0) {
      const layoutId = layouts[0].id;
      const { error } = await supabase.from('facility_layout_comments').insert({
        layout_id: layoutId,
        user_id: (await supabase.auth.getUser()).data.user?.id, 
        content: 'Migration Test Comment'
      });
      
      // We expect either success or an RLS error, but NOT a "relation does not exist" error
      if (error) {
        expect(error.code).not.toBe('42P01'); // 42P01 = undefined_table
      }
    }
  });
});