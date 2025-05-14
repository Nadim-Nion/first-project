import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();

  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  // Basic course info update
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
    id,
    courseRemainingData,
    {
      new: true,
      runValidators: true,
    },
  );

  // console.log('preRequisiteCourses:', preRequisiteCourses);

  // Check if there is or are pre-requisite courses to update
  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    // Filter out deleted pre-requisite courses
    const deletePreRequisites = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course);

    // console.log('filteredPreRequisiteCourses:', filteredPreRequisiteCourses);

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
      id,
      {
        $pull: {
          preRequisiteCourses: {
            course: { $in: deletePreRequisites },
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    // Filter out pre-requisite courses that are not deleted
    const newPreRequisites = preRequisiteCourses?.filter(
      (el) => el.course && !el.isDeleted,
    );

    // console.log('newPreRequisites:', newPreRequisites);

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
      $addToSet: {
        preRequisiteCourses: {
          $each: newPreRequisites,
        },
      },
    });
  }

  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );

  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
