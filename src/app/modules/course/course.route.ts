import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  CourseControllers.getAllCourses,
);

router.get(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  CourseControllers.deleteCourse,
);

router.put(
  '/:courseId/assign-faculties',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoutes = router;
