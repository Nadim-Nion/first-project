import { model, Schema } from 'mongoose';
import { AdminModel, TAdmin, TUserName } from './admin.interface';
import { BloodGroup, Gender } from './admin.constant';

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

const adminSchema = new Schema<TAdmin, AdminModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: `{VALUE} is not a valid gender`,
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact Number is required'],
    },
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
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImg: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// generating full name
adminSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// checking if user is already exist
adminSchema.statics.isAdminExists = async function (id: string) {
  const existingAdmin = await Admin.findOne({ id });
  return existingAdmin;
};

export const Admin = model<TAdmin, AdminModel>('Admin', adminSchema);
