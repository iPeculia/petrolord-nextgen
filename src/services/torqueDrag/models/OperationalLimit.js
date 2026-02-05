import { z } from 'zod';

export const OperationalLimitSchema = z.object({
  limit_id: z.string().uuid(),
  component_id: z.string().uuid(),
  limit_type: z.enum(['Tension', 'Compression', 'Torque', 'Burst', 'Collapse']),
  value: z.number(),
  safety_factor: z.number().default(1.1),
});

export const validateOperationalLimit = (data) => {
  try {
    return { success: true, data: OperationalLimitSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};