import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';
const router = express.Router();

// will call controller function
router.post(
  '/create-academic-semester',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  AcademicSemesterControllers.getAllAcademicSemesters,
);
router.get(
  '/:semesterId',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  AcademicSemesterControllers.getSingleAcademicSemester,
);
router.patch(
  '/:semesterId',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

export const AcademicSemesterRoutes = router;
