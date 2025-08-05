import { Schema, model } from 'mongoose';
import { TFaculty, TUserName } from './faculty.interface';
import { BloodGroup, Gender } from './faculty.constant';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxLength: [20, 'First Name can not be more than 20 characters'],
  },
  middleName: {
    type: String,
    required: [true, 'Middle Name is required'],
    trim: true,
    maxLength: [20, 'Middle Name can not be more than 20 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
    maxLength: [20, 'Last Name can not be more than 20 characters'],
  },
});

const facultySchema = new Schema<TFaculty>(
  {
    id: { type: String, required: [true, 'Id is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User Id is required'],
      unique: true,
    },
    designation: { type: String, required: [true, 'Designation is required'] },
    name: { type: userNameSchema, required: [true, 'Name is required'] },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: `{VALUE} is not a valid gender`,
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: `{VALUE} is not a valid blood group`,
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
    profileImage: { type: String, default: '' },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: [true, 'Academic Department is required'],
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: [true, 'Academic Faculty is required'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

// Generating Full Name using Mongoose Virtual
facultySchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

export const Faculty = model<TFaculty>('Faculty', facultySchema);
