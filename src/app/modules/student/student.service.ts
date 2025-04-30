import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Student } from './student.model';
import { TStudent } from './student.interface';

const getAllStudentFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
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
  const result = await Student.findOne({id})
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
  const result = await Student.findOneAndUpdate({id}, payload, {new: true});
  return result;
};

const deleteStudentFromDB = async (id: string) => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    // Delete student (Transaction-1)
    const deletedStudent = await Student.findOneAndUpdate({ id: id }, { isDeleted: true }, {new: true, session});

    if(!deletedStudent){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student.');
    }

    // Delete user (Transaction-2)
    const deletedUser = await User.findOneAndUpdate({id: id}, {isDeleted: true}, {new: true, session});

    if(!deletedUser){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user.');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession()
    throw error;
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
