import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
const router = express.Router();

const armyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('This is an army middleware');
  next();
};

// will call controller function
router.post('/create-student', armyMiddleware, UserControllers.createStudent);

export const UserRoutes = router;
