import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]+)"/);
  const extractedMsg = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMsg} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleDuplicateError;
