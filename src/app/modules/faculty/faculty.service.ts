import { Faculty } from './faculty.model';

const getAllFacultiesFromDB = async () => {
  const result = await Faculty.find();
  return result;
};

export const FacultyService = {
  getAllFacultiesFromDB,
};
