import { z } from 'zod';
import { BloodGroup, Gender } from './faculty.constant';

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First Name is required')
    .max(20, 'First Name cannot exceed 20 characters')
    .refine(
      (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() === value,
      { message: 'First Name must be in capitalize format' },
    ),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, 'Last Name is required')
    .max(20, 'Last Name cannot exceed 20 characters')
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: 'Last Name is not valid',
    }),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required').max(20),
    faculty: z.object({
      designation: z.string(),
      name: createUserNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]], {
        message: '{VALUE} is not a valid gender',
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Email is not valid'),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]], {message: '{VALUE} is not a valid blood group'}),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      academicDepartment: z.string(),
      profileImg: z.string(),
    }),
  }),
});

export const FacultyValidation = {
  createFacultyValidationSchema,
};
