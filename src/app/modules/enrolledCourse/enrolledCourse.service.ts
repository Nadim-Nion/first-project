import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import httpStatus from 'http-status';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /*
   1. Step-1: Check if the offeredCourse is exits or not
   2. Step-2: Check if the student is already enrolled in the offeredCourse
   3. Step-3: Create an enrolledCourse
  */

  // Step-1
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  console.log('isOfferedCourseExists:', isOfferedCourseExists);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course is not found');
  }

  // Check the current number of enrolled students
  const enrolledCount = await EnrolledCourse.countDocuments({ offeredCourse });
  console.log('Currently enrolled:', enrolledCount);
  console.log('Max capacity:', isOfferedCourseExists.maxCapacity);

  if (
    isOfferedCourseExists.maxCapacity <= 0 &&
    enrolledCount > isOfferedCourseExists.maxCapacity
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Course enrollment capacity reached',
    );
  }

  // Step-2
  const isStudentExists = await Student.findOne({ id: userId });
  console.log('isStudentExists:', isStudentExists);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: isStudentExists._id,
  });
  console.log('isStudentAlreadyEnrolled:', isStudentAlreadyEnrolled);

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already existed');
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
