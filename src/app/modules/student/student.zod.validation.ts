// import { object } from 'joi';
import { z } from 'zod';

// Creating schema validation using Zod

// Create UserName Schema
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
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: 'Last Name is not valid',
    }),
});

// Create Guardian Schema
const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is required'),
  fatherOccupation: z.string().min(1, 'Father Occupation is required'),
  fatherContactNo: z.string().min(1, 'Father Contact Number is required'),
  motherName: z.string().min(1, 'Mother Name is required'),
  motherOccupation: z.string().min(1, 'Mother Occupation is required'),
  motherContactNo: z.string().min(1, 'Mother Contact Number is required'),
});

// Create Local Guardian Schema
const createLocalGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name is required'),
  occupation: z.string().min(1, 'Local Guardian Occupation is required'),
  contactNo: z.string().min(1, 'Local Guardian Contact Number is required'),
  address: z.string().min(1, 'Local Guardian Address is required'),
});

// Main Create Student Schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required').max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['Male', 'Female', 'Other'], {
        errorMap: () => ({ message: 'Gender is not valid' }),
      }),
      dateOfBirth: z.string().date().optional(),
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
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      // profileImg: z.string().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

// Update Student Schema
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, 'First Name cannot exceed 20 characters')
    .refine(
      (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() === value,
      { message: 'First Name must be in capitalize format' },
    )
    .optional(),

  middleName: z.string().optional(),

  lastName: z
    .string()
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: 'Last Name is not valid',
    })
    .optional(),
});

// Update Guardian Schema
const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

// Update Local Guardian Schema
const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

// Main Update Student Schema
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z
      .object({
        name: updateUserNameValidationSchema.optional(),
        gender: z
          .enum(['Male', 'Female', 'Other'], {
            errorMap: () => ({ message: 'Gender is not valid' }),
          })
          .optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email('Email is not valid').optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        guardian: updateGuardianValidationSchema.optional(),
        localGuardian: updateLocalGuardianValidationSchema.optional(),
        profileImg: z.string().optional(),
        admissionSemester: z.string().optional(),
        academicDepartment: z.string().optional(),
      })
      .optional(),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
