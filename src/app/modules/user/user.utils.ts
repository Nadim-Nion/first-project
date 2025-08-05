import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

// Generated Student Id structure: <year><semester code><4-digit numbers>
// For example: 2030 03 0001
// 203003  0001

// Find Last Student ID
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

  return lastStudent?.id ? lastStudent.id : undefined;
};

// Generate Student Id
export const generateStudentId = async (payload: TAcademicSemester) => {
  // Generated Id will be 0000 for the first student
  let currentId = (0).toString(); // 0000 by default

  const lastStudentId = await findLastStudentId(); // 2030 01 0001
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentYear = lastStudentId?.substring(0, 4); // 2030

  const currentSemesterCode = payload.code; // 03
  const currentYear = payload.year; // 2030

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

// Find Last Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
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

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

// Generate Faculty Id
export const generateFacultyId = async () => {
  // Generated Id will be 0000 for the first student
  let currentId = (0).toString();

  const lastFacultyId = await findLastFacultyId(); // 0001

  if (lastFacultyId) {
    currentId = lastFacultyId; // 0001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;
  return incrementId;
};

// Find Last Admin Id
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      _id: 0,
      id: 1,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

// Generate Admin ID
export const generateAdminId = async () => {
  // Generated Id will be 0000 for the first student
  let currentId = (0).toString();

  const lastAdminId = await findLastAdminId(); // 0001
  if (lastAdminId) {
    currentId = lastAdminId; // 0001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `A-${incrementId}`;
  return incrementId;
};
