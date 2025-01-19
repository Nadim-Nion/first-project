// import { object } from 'joi';
import { z } from 'zod';

// Creating schema validation using Zod

// UserName Schema
const userNameValidationSchema = z.object({
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
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: 'Last Name is not valid',
    }),
});

// Guardian Schema
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is required'),
  fatherOccupation: z.string().min(1, 'Father Occupation is required'),
  fatherContactNo: z.string().min(1, 'Father Contact Number is required'),
  motherName: z.string().min(1, 'Mother Name is required'),
  motherOccupation: z.string().min(1, 'Mother Occupation is required'),
  motherContactNo: z.string().min(1, 'Mother Contact Number is required'),
});

// Local Guardian Schema
const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name is required'),
  occupation: z.string().min(1, 'Local Guardian Occupation is required'),
  contactNo: z.string().min(1, 'Local Guardian Contact Number is required'),
  address: z.string().min(1, 'Local Guardian Address is required'),
});

// Main Student Schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required').max(20),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['Male', 'Female', 'Other'], {
        errorMap: () => ({ message: 'Gender is not valid' }),
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().min(1, 'Email is required').email('Email is not valid'),
      contactNo: z.string().min(1, 'Contact Number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency Contact Number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present Address is required'),
      permanentAddress: z.string().min(1, 'Permanent Address is required'),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
