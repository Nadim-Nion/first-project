import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Student } from './student.model';
import { TStudent } from './student.interface';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  /* {email: {$regex: query.searchTerm, $options: "i"}} */
  /* {presentAddress: {$regex: query.searchTerm, $options: "i"}} */
  /* {"name.firstName": {$regex: query.searchTerm, $options: "i"}} */

  console.log('base query:', query);
  const queryObject = { ...query }; // copy the query object from base query

  const studentSearchableFields = ['email', 'presentAddress', 'name.firstName'];

  // Searching

  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // Filtering
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((el) => delete queryObject[el]);

  // console.log("query:", query);
  // console.log('queryObject:', queryObject);

  const filterQuery = searchQuery
    .find(queryObject)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // Sorting
  let sort = '-createdAt';
  if (query?.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  // Pagination and Limiting

  let page = 1;
  let limit = 1;
  let skip = 0;

  if (query?.limit) {
    limit = Number(query.limit) as number;
  }

  if (query?.page) {
    page = Number(query.page) as number;
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  // Field Limiting

  let fields = '-__v';
  if (query?.fields) {
    fields = (query.fields as string).split(',').join(' ');
  }

  const fieldQuery = await limitQuery.select(fields);

  return fieldQuery;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id: id });
  // const result = await Student.aggregate([
  //   {
  //     $match: {
  //       id: id,
  //     },
  //   },
  // ]);
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedStudentData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
    guardian: {
      fatherOccupation:"Teacher"
    }

    guardian.fatherOccupation = Teacher

    name.firstName = 'John'
    name.lastName = 'Doe'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudentData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedStudentData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedStudentData[`localGuardian.${key}`] = value;
    }
  }

  // console.log('modifiedStudentData', modifiedStudentData);

  const result = await Student.findOneAndUpdate({ id }, modifiedStudentData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Delete student (Transaction-1)
    const deletedStudent = await Student.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student.');
    }

    // Delete user (Transaction-2)
    const deletedUser = await User.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user.');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
