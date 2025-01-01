// import { TStudent } from './student.interface';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
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

  // manually generated id
  userData.id = '2030100001';

  // Create a user
  const newUser = await User.create(userData);

  // Create a student
  if (Object.keys(newUser).length) {
    // set id, _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference _id

    const newStudent = await Student.create(studentData);
    return newStudent;
  }

  // return newUser;
};

export const UserServices = {
  createStudentIntoDB,
};
