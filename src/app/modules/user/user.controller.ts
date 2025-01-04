import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudent: RequestHandler = async (req, res, next) => {
  try {
    // const student = req.body.student;
    const { password, student: studentData } = req.body;
    console.log(req.body);

    // Validation using Joi
    // const { error, value } = studentValidationSchema.validate(studentData);

    // Validation using Zod
    // const zodParsedData = studentValidationSchema.parse(studentData);

    // will call service function to send this data
    const result = await UserServices.createStudentIntoDB(
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
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};
