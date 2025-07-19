import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import httpStatus from 'http-status';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /*
   1. Step-1: Check if the offeredCourse is exits or not
   2. Step-2: Check if the student is already enrolled in the offeredCourse
   3. Step-3: Check whether total credits exceed maxCredits
   4. Step-4: Create an enrolledCourse
  */

  // Step-1: Check if the offeredCourse is exits or not
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course is not found');
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Course enrollment capacity reached',
    );
  }

  // Step-2: Check if the student is already enrolled in the offeredCourse
  const isStudentExists = await Student.findOne({ id: userId }, { _id: 1 });

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: isStudentExists._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled');
  }

  // Step-3: Check whether total credits exceed maxCredits
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const maxCredit = semesterRegistration?.maxCredit;

  const course = await Course.findById(isOfferedCourseExists.course);

  const currentCredit = course?.credits;

  /* 
  Logic:
  previous credit + new credit = total credit

  total credit can not be more than maxCredit
  */

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: isStudentExists._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded the maximum number of credits',
    );
  }

  // Step-4: Create an enrolledCourse
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create an Enrolled Course (Transaction-1)
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: isStudentExists._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in this course',
      );
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;

    // Update Offered Course (Transaction-2)
    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration is not found',
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course is not found');
  }

  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
