import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic Department Name is required',
      invalid_type_error: 'Academic Department must be a string',
    }),
    academicFaculty: z.string({
      required_error: 'Academic Faculty is required',
      invalid_type_error: 'Academic Faculty must be a string',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Academic Department Name is required',
        invalid_type_error: 'Academic Department must be a string',
      })
      .optional(),
    academicFaculty: z
      .string({
        required_error: 'Academic Faculty is required',
        invalid_type_error: 'Academic Faculty must be a string',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
