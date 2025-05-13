import { model, Schema } from 'mongoose';
import { TCourse, TPreRequisiteCourses } from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Course title is required'],
  },
  prefix: {
    type: String,
    trim: true,
    required: [true, 'Course Prefix is required'],
  },
  code: {
    type: Number,
    trim: true,
    required: [true, 'Course Code is required'],
  },
  credits: {
    type: Number,
    trim: true,
    required: [true, 'Course Credit is required'],
  },
  preRequisiteCourses: [preRequisiteCoursesSchema],
});

export const Course = model<TCourse>('Course', courseSchema);
