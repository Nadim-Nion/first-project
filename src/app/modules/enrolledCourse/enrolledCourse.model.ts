import { model, Schema } from 'mongoose';
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface';
import { Grade } from './enrolledCourse.constant';

const courseMarksSchema = new Schema<TCourseMarks>(
  {
    classTest1: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    midterm: {
      type: Number,
      default: 0,
      min: 0,
      max: 30,
    },
    classTest2: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    finalTerm: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
  },
  {
    _id: false,
  },
);

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    ref: 'SemesterRegistration',
    required: [true, 'Semester Registration is required'],
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
    required: [true, 'Academic Semester is required'],
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
  offeredCourse: {
    type: Schema.Types.ObjectId,
    ref: 'OfferedCourse',
    required: [true, 'Offered Course is required'],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required'],
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'Faculty is required'],
  },
  isEnrolled: {
    type: Boolean,
    default: false,
  },
  courseMarks: {
    type: courseMarksSchema,
    default: {},
  },
  grade: {
    type: String,
    enum: {
      values: Grade,
      message: `{VALUE} is not valid grade`,
    },
    default: 'NA',
  },
  gradePoints: {
    type: Number,
    default: 0,
    min: 0,
    max: 4,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

export const EnrolledCourse = model<TEnrolledCourse>(
  'EnrolledCourse',
  enrolledCourseSchema,
);
