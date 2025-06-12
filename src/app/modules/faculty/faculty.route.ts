import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from './faculty.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.faculty),
  FacultyController.getAllFaculties,
);

router.get('/:id', FacultyController.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyValidationSchema),
  FacultyController.updateFaculty,
);

router.delete('/:id', FacultyController.deleteFaculty);

export const FacultyRoutes = router;
