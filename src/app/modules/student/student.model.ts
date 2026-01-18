import { Schema, model } from 'mongoose';
import validator from 'validator';
import httpStatus from 'http-status';

import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface';
import AppError from '../../errors/AppError';

// import bcrypt from 'bcrypt';
// import config from '../../config';
// import { func } from 'joi';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is mandatory'],
    trim: true,
    maxLength: [20, 'First Name can not be allowed more than 20 characters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstNameStr === value;
      },
      message: '{VALUE} is not capitalize format',
    },
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, 'Last Name is mandatory'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, 'Father Name is required'] },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact Number is required'],
  },
  motherName: { type: String, required: [true, 'Mother Name is required'] },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact Number is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'Local Guardian Name is required'] },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact Number is required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is required'],
  },
});

// Define a schema
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
    },
    /* password: {
      type: String,
      required: [true, 'Password is required'],
      maxLength: [20, "Password can't be more than 20 characters"],
    }, */
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not valid email type',
      },
    },
    contactNo: { type: String, required: [true, 'Contact Number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact Number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian information is required'],
    },
    profileImg: { type: String, default: '' },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// Mongoose Virtual
studentSchema.virtual('fullName').get(function () {
  return (
    this.name?.firstName +
    ' ' +
    this.name?.middleName +
    ' ' +
    this.name?.lastName
  );
});

// Query Middleware
studentSchema.pre('find', function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  // console.log(this);
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      isDeleted: { $ne: true },
    },
  });
  next();
});

// Creating a custom static method
studentSchema.statics.isStudentExists = async function (id: string) {
  const existingStudent = await Student.findOne({ id: id });
  return existingStudent;
};

// Creating a custom instance method
/* studentSchema.methods.isStudentExists = async function (id: string) {
  const existingStudent = await Student.findOne({ id: id });

  return existingStudent;
}; */

studentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isStudentExist = await Student.findOne(query);

  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!');
  }

  next();
});

// Create a Model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
