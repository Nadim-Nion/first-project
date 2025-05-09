import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

// Generated Student Id structure: <year><semester code><4-digit numbers>
// For example: 2030 03 0001
// 203003  0001

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  // console.log('Last Student Id: ', lastStudent); // 203003 0001

  return lastStudent?.id ? lastStudent.id : undefined;
};

// I have watched the video of Module 13-1 till 9:14 mins

export const generateStudentId = async (payload: TAcademicSemester) => {
  // Generated Id will be 0000 for the first student
  let currentId = (0).toString(); // 0000 by default

  const lastStudentId = await findLastStudentId(); // 2030 01 0001
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentYear = lastStudentId?.substring(0, 4); // 2030

  const currentSemesterCode = payload.code; // 03
  const currentYear = payload.year; // 2030

  // I have watched the video of Module 13-2 till 5:12 mins

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6); // 0001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};
