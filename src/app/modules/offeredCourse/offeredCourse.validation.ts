import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringValidationSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
  },
  {
    message: 'Invalid time format. Use HH:MM (24-hour format).',
  },
);

// I have watched the video of module (16-7) till 9:04 mins

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      // academicSemester: z.string().optional(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringValidationSchema,
      endTime: timeStringValidationSchema,
    })
    .refine(
      (body) => {
        const startTime = body.startTime;
        const endTime = body.endTime;

        // startTime : 10:30  => 1970-01-01T10:30
        //endTime : 12:30  =>  1970-01-01T12:30

        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        return end > start;
      },
      {
        message: 'End time must be greater than start time',
        path: ['endTime'],
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringValidationSchema,
      endTime: timeStringValidationSchema,
    })
    .refine(
      (body) => {
        const startTime = body.startTime;
        const endTime = body.endTime;

        // startTime : 10:30  => 1970-01-01T10:30
        //endTime : 12:30  =>  1970-01-01T12:30

        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        return end > start;
      },
      {
        message: 'End time must be greater than start time',
        path: ['endTime'],
      },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
