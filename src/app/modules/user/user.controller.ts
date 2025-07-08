import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const file = req.file;

  // const student = req.body.student;
  const { password, student: studentData } = req.body;
  // console.log(req.body);

  // Validation using Joi
  // const { error, value } = studentValidationSchema.validate(studentData);

  // Validation using Zod
  // const zodParsedData = studentValidationSchema.parse(studentData);

  // will call service function to send this data
  const result = await UserServices.createStudentIntoDB(
    file,
    password,
    studentData,
  );

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
  const file = req.file;

  const result = await UserServices.createFacultyIntoDB(
    file,
    password,
    facultyData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  const file = req.file;

  const result = await UserServices.createAdminIntoDB(
    file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  // const token = req.headers.authorization;

  // if (!token) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Token is not found');
  // }

  const { userId, role } = req.user;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is changed successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
