import { TEnrolledCourse } from './enrolledCourse.interface';

const createEnrolledCourseIntoDB = async (
  id: string,
  payload: TEnrolledCourse,
) => {
  /*
   1. Step-1: Check if the offeredCourse is exits or not
   2. Step-2: Check if the student is already enrolled in the offeredCourse
   3. Step-3: Create an enrolledCourse
  */
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
