import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isAcademicDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isAcademicDepartmentExist) {
    throw new Error('Academic Department already exists!');
  }

  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  console.log(query);

  const isAcademicDepartmentExist = await AcademicDepartment.findOne(query);
  console.log(isAcademicDepartmentExist);

  if (!isAcademicDepartmentExist) {
    throw new Error('Academic Department does not exist!');
  };

  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
