import { z } from 'zod';

export const DrillStringSchema = z.object({
  drill_string_id: z.string().uuid(),
  well_id: z.string().uuid(),
  name: z.string().min(1),
  components: z.array(z.any()), 
  created_date: z.string().datetime(),
});

export const validateDrillString = (data) => {
  try {
    return { success: true, data: DrillStringSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};