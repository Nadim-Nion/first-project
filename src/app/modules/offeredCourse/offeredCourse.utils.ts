import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedule: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedule) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}:00`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}:00`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}:00`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}:00`);

    /* 
    Handle time conflict:
    If the new schedule starts before the existing schedule ends and ends after the existing schedule starts, then there is a conflict.

    Old Schedule: 10:00 - 12:00
    New Schedule: 11:00 - 1:00

    When there is no conflict:
    Old Schedule: 10:00 - 12:00 
    New Schedule: 12:00 - 2:00
    */

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
    //   console.log('Conflict found');
      return true; // Conflict found
    }
  }

  return false; // No conflict found
};
