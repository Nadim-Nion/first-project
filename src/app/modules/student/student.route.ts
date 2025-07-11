import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.zod.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';
const router = express.Router();

// will call controller function
router.get('/', StudentControllers.getAllStudents);
router.get(
  '/:studentId',
  auth(UserRole.admin, UserRole.faculty),
  StudentControllers.getSingleStudent,
);
router.patch(
  '/:studentId',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);
router.delete('/:studentId', StudentControllers.deleteStudent);

export const StudentRoutes = router;
