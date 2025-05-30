import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { RegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import httpStatus from 'http-status';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // Check if there is any registered semester that is 'UPCOMING' or 'ONGOING'
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} semester registration. Please complete it before creating a new one.`,
    );
  }

  //  Check a semester exists or not before doing a semester registration
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  // Check if a semester registration already exists for the given academic semester
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Semester registration already exists for this academic semester',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const requestedSemesterStatus = payload?.status;

  // Check if the requested semester registration exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Semester Registration is not found',
    );
  }

  // If the requested semester registration is ended, we won't allow to update it
  const currentSemesterStatus = isSemesterRegistrationExists.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot update an ${currentSemesterStatus} semester registration`,
    );
  }

  // Correct status flow of semester registration: UPCOMING -> ONGOING -> ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot directly change from ${currentSemesterStatus} to ${requestedSemesterStatus} semester registration. Please change it to ONGOING first.`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot directly change from ${currentSemesterStatus} to ${requestedSemesterStatus} semester registration. Please change it to ENDED first.`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationIntoDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registration when the status is 
  'UPCOMING'.
  **/

  // Check if the semester registration exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Semester Registration is not found',
    );
  }

  // Check if the semester registration status is 'UPCOMING'
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;
  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not delete a semester registration when its status is ${semesterRegistrationStatus}`,
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Transaction Step 1: Delete associated offered courses
    const deletedOfferedCourses = await OfferedCourse.deleteMany(
      { semesterRegistration: id },
      { new: true, session },
    );

    if (!deletedOfferedCourses) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete associated offered courses',
      );
    }

    // Transaction Step 2: Delete semester registration
    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        new: true,
        session,
      });

    if (!deletedSemesterRegistration) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete semester registration',
      );
    }

    session.commitTransaction();
    session.endSession();

    return null; // Return null to indicate successful deletion
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    throw err; // Rethrow the error to be handled by the caller
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationIntoDB,
};
