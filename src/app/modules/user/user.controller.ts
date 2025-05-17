import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  // const student = req.body.student;
  const { password, student: studentData } = req.body;
  // console.log(req.body);

  // Validation using Joi
  // const { error, value } = studentValidationSchema.validate(studentData);

  // Validation using Zod
  // const zodParsedData = studentValidationSchema.parse(studentData);

  // will call service function to send this data
  const result = await UserServices.createStudentIntoDB(password, studentData);

  /* if (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.details,
    });
  } */

  // send response
  /* res.status(200).json({
    success: true,
    message: 'Student is created successfully',
    data: result,
  }); */

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  });
});

const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
};
