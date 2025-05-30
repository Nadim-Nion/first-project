import { model, Schema } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'SemesterRegistration',
      required: [true, 'Semester Registration is required'],
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      // required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: [true, 'Academic Faculty is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: [true, 'Academic Department is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max Capacity is required'],
    },
     section: {
      type: Number,
      required: true,
    },
    days: [
      {
        type: String,
        enum: {
          values: Days,
          message: '{VALUE} is not a valid day',
        },
      },
    ],
    startTime: {
      type: String,
      required: [true, 'Start Time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End Time is required'],
    },
  },
  {
    timestamps: true,
  },
);

export const OfferedCourse = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);
