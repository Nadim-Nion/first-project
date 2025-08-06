import express from 'express';
import { OfferedCourseControllers } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-offered-course',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty),
  OfferedCourseControllers.getAllOfferedCourses,
);

router.get(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  OfferedCourseControllers.getSingleOfferedCourse,
);

router.patch(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin),
  OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoutes = router;
