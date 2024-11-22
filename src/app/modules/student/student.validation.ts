import Joi from 'joi';

// Creating a schema validation using Joi

// Joi Schema for UserName
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .required()
    .regex(/^[A-Z][a-z]*$/)
    .messages({
      'string.base': 'First Name must be a string',
      'string.empty': 'First Name is mandatory',
      'string.max': 'First Name cannot be more than 20 characters',
      'string.pattern.base': '{#value} is not in capitalize format',
    }),
  middleName: Joi.string().trim().allow(null, ''),
  lastName: Joi.string()
    .required()
    .pattern(/^[A-Za-z]+$/)
    .messages({
      'string.base': 'Last Name must be a string',
      'string.empty': 'Last Name is mandatory',
      'string.pattern.base': '{#value} is not valid',
    }),
});

// Joi Schema for Guardian
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'string.empty': 'Father Name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'string.empty': 'Father Occupation is required',
  }),
  fatherContactNo: Joi.string().required().messages({
    'string.empty': 'Father Contact Number is required',
  }),
  motherName: Joi.string().required().messages({
    'string.empty': 'Mother Name is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'string.empty': 'Mother Occupation is required',
  }),
  motherContactNo: Joi.string().required().messages({
    'string.empty': 'Mother Contact Number is required',
  }),
});

// Joi Schema for Local Guardian
const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Local Guardian Name is required',
  }),
  occupation: Joi.string().required().messages({
    'string.empty': 'Local Guardian Occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Local Guardian Contact Number is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Local Guardian Address is required',
  }),
});

// Joi Schema for Student
const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  name: userNameValidationSchema.required().messages({
    'object.base': 'Name is required',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
    'any.only': '{#value} is not a valid gender',
    'string.empty': 'Gender is required',
  }),
  dateOfBirth: Joi.string().isoDate().messages({
    'string.isoDate': 'Date of Birth must be a valid ISO date string',
  }),
  email: Joi.string().email().required().messages({
    'string.email': '{#value} is not a valid email',
    'string.empty': 'Email is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Contact Number is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'string.empty': 'Emergency Contact Number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .messages({
      'any.only': '{#value} is not a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present Address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent Address is required',
  }),
  guardian: guardianValidationSchema.required().messages({
    'object.base': 'Guardian information is required',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
    'object.base': 'Local Guardian information is required',
  }),
  profileImg: Joi.string().uri().allow(null, ''),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': '{#value} is not a valid status',
  }),
});

export default studentValidationSchema;
