import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Name must be a string' })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema
};
