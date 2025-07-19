export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: 'NA',
    gradePoint: 0,
  };

  /* 
    1. F   (0-40)    => Grade Point: 0.00
    2. D   (41-50)   => Grade Point: 1.00
    3. C   (51-60)   => Grade Point: 2.00
    4. B   (61-70)   => Grade Point: 3.00
    5. A   (71-80)   => Grade Point: 4.00
    6. A+  (81-100)  => Grade Point: 5.00
  */

  if (totalMarks >= 0 && totalMarks <= 40) {
    result = {
      grade: 'F',
      gradePoint: 0.0,
    };
  } else if (totalMarks >= 41 && totalMarks <= 50) {
    result = {
      grade: 'D',
      gradePoint: 1.0,
    };
  } else if (totalMarks >= 51 && totalMarks <= 60) {
    result = {
      grade: 'C',
      gradePoint: 2.0,
    };
  } else if (totalMarks >= 61 && totalMarks <= 70) {
    result = {
      grade: 'B',
      gradePoint: 3.0,
    };
  } else if (totalMarks >= 71 && totalMarks <= 80) {
    result = {
      grade: 'A',
      gradePoint: 4.0,
    };
  } else if (totalMarks >= 81 && totalMarks <= 100) {
    result = {
      grade: 'A+',
      gradePoint: 5.0,
    };
  } else {
    result = {
      grade: 'NA',
      gradePoint: 0,
    };
  }

  return result;
};
