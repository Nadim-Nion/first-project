import { z } from 'zod';

const academicFacultyValidationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
});

export const AcademicFacultyValidations = {
  academicFacultyValidationSchema,
};
