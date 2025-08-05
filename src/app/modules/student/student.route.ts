import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.zod.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';
const router = express.Router();

// will call controller function
router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  StudentControllers.getAllStudents,
);
router.get(
  '/:studentId',
  auth(UserRole.admin, UserRole.faculty, UserRole.superAdmin),
  StudentControllers.getSingleStudent,
);
router.patch(
  '/:studentId',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);
router.delete(
  '/:studentId',
  auth(UserRole.admin, UserRole.superAdmin),
  StudentControllers.deleteStudent,
);

export const StudentRoutes = router;
