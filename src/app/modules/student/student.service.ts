import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  if (await Student.isStudentExists(studentData.id)) {
    throw new Error('User already exists');
  }

  const result = await Student.create(studentData); // built-in static method of Mongoose

  /*  const student = new Student(studentData); //create an instance
  if (await student.isStudentExists(studentData.id)) {
    throw new Error('User already exists');
  }
  const result = await student.save(); // Built-in instance method of mongoose */

  return result;
};

const getAllStudentFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id: id });
  const result = await Student.aggregate([
    {
      $match: {
        id: id,
      },
    },
  ]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id: id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
