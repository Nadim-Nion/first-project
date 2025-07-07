import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { verifyToken } from '../Auth/auth.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // If password is not given, use default password
  userData.password = password || (config.default_password as string);
  /* if (!password) {
    user.password = config.default_password as string;
  } else {
    user.password = password;
  } */

  // set student role
  userData.role = 'student';

  // set student email
  userData.email = payload?.email;

  // Find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  // automatically generated id from the server
  // userData.id = generateStudentId(admissionSemester);
  if (admissionSemester) {
    userData.id = await generateStudentId(admissionSemester);
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Admission semester data is missing.',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create a user (Transaction-1)
    const newUser = await User.create([userData], { session });
    // console.log('newUser', newUser);

    // Create a student (Transaction-2)
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user.');
    }
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    const newStudent = await Student.create([payload], { session });
    // console.log('newStudent', newStudent);

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student.');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // return newUser;
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // If password is not given, use default password
  userData.password = password || config.default_password;

  // set faculty role
  userData.role = 'faculty';

  // set faculty email
  userData.email = payload?.email;

  // Find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic department data is missing.',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Automatically generate id from the server
    userData.id = await generateFacultyId();

    // Create a user (Transaction-1)
    const newUser = await User.create([userData], { session });
    // console.log('newUser in user.service', newUser);

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user.');
    }

    // Set id as an embedded field and _id as a user (referenced field)
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // Create a faculty (Transaction-2)
    const newFaculty = await Faculty.create([payload], { session });
    // console.log('newFaculty in user.service', newFaculty);

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty.');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // Create a User Object
  const userData: Partial<TUser> = {};

  // If password is not given, use default password
  userData.password = password || config.default_password;

  // set admin role
  userData.role = 'admin';

  // set admin email
  userData.email = payload?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Automatically generate id from the server
    userData.id = await generateAdminId();

    // Create a user (Transaction-1)
    const newUser = await User.create([userData], { session });
    // console.log('newUser in user.service:', newUser);

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // Set id as an embedded field and _id as a user (referenced field)
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // Create a admin (Transaction-2)
    const newAdmin = await Admin.create([payload], { session });
    // console.log('newAdmin in user.service:', newAdmin);

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const getMe = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { userId, role } = decoded;

  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate(
      'user admissionSemester academicDepartment',
    );
  } else if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  } else if (role === 'faculty') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
};
