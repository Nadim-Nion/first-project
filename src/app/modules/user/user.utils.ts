import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
// Generated Student Id structure: <year><semester code><4-digit numbers>
// For example: 2030 03 0001

export const generateStudentId = (payload: TAcademicSemester) => {
  // Generated Id will be 0000 for the first student
  const currentId = (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};
