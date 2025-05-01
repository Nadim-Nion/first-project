import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

// interface CustomError extends Error {
//   statusCode?: number;
// }

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next,
) => {
  // Setting default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  type TErrorSource = {
    path: string | number;
    message: string;
  }[];

  const errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if(err instanceof ZodError){
    statusCode = 400;
    message = 'Zod Validation Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: err,
  });
};

export default globalErrorHandler;

/* 

Error Pattern:

success
message
errorSources: [
path: '',
message: ''
]
stack

*/
