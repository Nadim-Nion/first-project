import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const result = await AcademicFaculty.create(payload);
    return result;
};

const getAllAcademicFacultiesFromDB = async () => {
    const result = await AcademicFaculty.find();
    return result;
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
    const result = await AcademicFaculty.findById(id);
    return result;
}

/* I have watched the video of module (13-3) till 2:59 seconds. I'll start practicing code and resume watching the video from here. */

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB
};