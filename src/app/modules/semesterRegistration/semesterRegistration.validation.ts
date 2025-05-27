import { z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().min(1, 'Academic semester is required'),
    status: z.enum([...SemesterRegistrationStatus] as [string, ...string[]]),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z
      .number()
      .min(0, 'Minimum credit must be a non-negative number')
      .optional(),
    maxCredit: z
      .number()
      .min(0, 'Maximum credit must be a non-negative number')
      .optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
};
