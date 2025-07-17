import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth(UserRole.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

export const EnrolledCourseRoutes = router;
