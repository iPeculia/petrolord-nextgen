import { supabase } from '@/lib/supabaseClient';

// Helper to handle Supabase responses
const handleResponse = async (promise) => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('PTA Service Error:', error.message);
    throw error;
  }
};

export const pressureTransientService = {
  // --- WELLS ---
  async createWell(well) {
    // Remove transient properties if any
    const { well_id, ...payload } = well;
    return handleResponse(
      supabase
        .from('pta_wells')
        .insert([payload])
        .select()
        .single()
    );
  },

  async updateWell(well_id, well) {
    return handleResponse(
      supabase
        .from('pta_wells')
        .update(well)
        .eq('well_id', well_id)
        .select()
        .single()
    );
  },

  async deleteWell(well_id) {
    return handleResponse(
      supabase
        .from('pta_wells')
        .delete()
        .eq('well_id', well_id)
    );
  },

  async getWell(well_id) {
    return handleResponse(
      supabase
        .from('pta_wells')
        .select('*')
        .eq('well_id', well_id)
        .single()
    );
  },

  async getAllWells() {
    return handleResponse(
      supabase
        .from('pta_wells')
        .select('*')
        .order('created_at', { ascending: false })
    );
  },

  // --- RESERVOIRS ---
  async createReservoir(reservoir) {
    return handleResponse(
      supabase
        .from('pta_reservoirs')
        .insert([reservoir])
        .select()
        .single()
    );
  },

  async updateReservoir(reservoir_id, reservoir) {
    return handleResponse(
      supabase
        .from('pta_reservoirs')
        .update(reservoir)
        .eq('reservoir_id', reservoir_id)
        .select()
        .single()
    );
  },

  async deleteReservoir(reservoir_id) {
    return handleResponse(
      supabase
        .from('pta_reservoirs')
        .delete()
        .eq('reservoir_id', reservoir_id)
    );
  },

  async getReservoir(reservoir_id) {
    return handleResponse(
      supabase
        .from('pta_reservoirs')
        .select('*')
        .eq('reservoir_id', reservoir_id)
        .single()
    );
  },

  async getReservoirByWell(well_id) {
    return handleResponse(
      supabase
        .from('pta_reservoirs')
        .select('*')
        .eq('well_id', well_id)
        .maybeSingle() // Use maybeSingle as a well might not have reservoir data yet
    );
  },

  // --- FLUIDS ---
  async createFluid(fluid) {
    return handleResponse(
      supabase
        .from('pta_fluids')
        .insert([fluid])
        .select()
        .single()
    );
  },

  async updateFluid(fluid_id, fluid) {
    return handleResponse(
      supabase
        .from('pta_fluids')
        .update(fluid)
        .eq('fluid_id', fluid_id)
        .select()
        .single()
    );
  },

  async deleteFluid(fluid_id) {
    return handleResponse(
      supabase
        .from('pta_fluids')
        .delete()
        .eq('fluid_id', fluid_id)
    );
  },

  async getFluid(fluid_id) {
    return handleResponse(
      supabase
        .from('pta_fluids')
        .select('*')
        .eq('fluid_id', fluid_id)
        .single()
    );
  },

  async getFluidByWell(well_id) {
    return handleResponse(
      supabase
        .from('pta_fluids')
        .select('*')
        .eq('well_id', well_id)
        .maybeSingle()
    );
  },

  // --- PRESSURE TESTS ---
  async createTest(test) {
    // Separate data points if included (though normally handled separately)
    const { data_points, ...testPayload } = test;
    
    const newTest = await handleResponse(
      supabase
        .from('pta_pressure_tests')
        .insert([testPayload])
        .select()
        .single()
    );

    if (data_points && data_points.length > 0) {
      const pointsPayload = data_points.map(dp => ({
        ...dp,
        test_id: newTest.test_id
      }));
      
      await handleResponse(
        supabase
          .from('pta_test_data_points')
          .insert(pointsPayload)
      );
    }

    return newTest;
  },

  async updateTest(test_id, test) {
    const { data_points, ...testPayload } = test;
    return handleResponse(
      supabase
        .from('pta_pressure_tests')
        .update(testPayload)
        .eq('test_id', test_id)
        .select()
        .single()
    );
  },

  async deleteTest(test_id) {
    return handleResponse(
      supabase
        .from('pta_pressure_tests')
        .delete()
        .eq('test_id', test_id)
    );
  },

  async getTest(test_id) {
    return handleResponse(
      supabase
        .from('pta_pressure_tests')
        .select('*')
        .eq('test_id', test_id)
        .single()
    );
  },

  async getTestsByWell(well_id) {
    return handleResponse(
      supabase
        .from('pta_pressure_tests')
        .select('*')
        .eq('well_id', well_id)
        .order('start_time', { ascending: false })
    );
  },

  async getAllTests() {
     return handleResponse(
      supabase
        .from('pta_pressure_tests')
        .select('*')
        .order('created_at', { ascending: false })
    );
  },

  // --- DATA POINTS ---
  async createDataPoint(datapoint) {
    return handleResponse(
      supabase
        .from('pta_test_data_points')
        .insert([datapoint])
        .select()
        .single()
    );
  },

  async updateDataPoint(datapoint_id, datapoint) {
    return handleResponse(
      supabase
        .from('pta_test_data_points')
        .update(datapoint)
        .eq('datapoint_id', datapoint_id)
        .select()
        .single()
    );
  },

  async deleteDataPoint(datapoint_id) {
    return handleResponse(
      supabase
        .from('pta_test_data_points')
        .delete()
        .eq('datapoint_id', datapoint_id)
    );
  },

  async getDataPointsByTest(test_id) {
    return handleResponse(
      supabase
        .from('pta_test_data_points')
        .select('*')
        .eq('test_id', test_id)
        .order('time_hours', { ascending: true })
    );
  },

  // --- ANALYSIS RESULTS ---
  async createResult(result) {
    return handleResponse(
      supabase
        .from('pta_analysis_results')
        .insert([result])
        .select()
        .single()
    );
  },

  async updateResult(result_id, result) {
    return handleResponse(
      supabase
        .from('pta_analysis_results')
        .update(result)
        .eq('result_id', result_id)
        .select()
        .single()
    );
  },

  async deleteResult(result_id) {
    return handleResponse(
      supabase
        .from('pta_analysis_results')
        .delete()
        .eq('result_id', result_id)
    );
  },

  async getResult(result_id) {
    return handleResponse(
      supabase
        .from('pta_analysis_results')
        .select('*')
        .eq('result_id', result_id)
        .single()
    );
  },

  async getResultsByTest(test_id) {
    return handleResponse(
      supabase
        .from('pta_analysis_results')
        .select('*')
        .eq('test_id', test_id)
        .order('created_at', { ascending: false })
    );
  },

  async getAllResults() {
      return handleResponse(
      supabase
        .from('pta_analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
    );
  }
};