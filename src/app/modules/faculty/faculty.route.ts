import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyController.getAllFaculties);
router.get('/:id', FacultyController.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyValidationSchema),
  FacultyController.updateFaculty,
);

export const FacultyRoutes = router;
