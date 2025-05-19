import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.zod.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
const router = express.Router();

// will call controller function
router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(FacultyValidation.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
