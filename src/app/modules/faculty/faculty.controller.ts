import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { FacultyService } from './faculty.service';
import sendResponse from '../../utils/sendResponse';

const getAllFaculties: RequestHandler = catchAsync(async (req, res) => {
  const result = await FacultyService.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All faculties retrieved successfully',
    data: result,
  });
});

export const FacultyController = {
  getAllFaculties,
};
