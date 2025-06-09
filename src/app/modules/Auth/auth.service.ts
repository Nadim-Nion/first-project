import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  // check the user is exist or not
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check the user is deleted or not
  const isUserDeleted = user?.isDeleted;

  if (isUserDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is deleted, please contact with admin',
    );
  }

  // Check the user is blocked or not
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is blocked, please contact with admin',
    );
  }

  // Check the password is correct or not
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // Access Granted: send access and refresh token
  // Create and send token to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });
  return {
    accessToken,
    needPasswordChange: user?.needsPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};

/* 

// Step-1: Check the user is exists or not
const isUserExists = await User.findOne({
    id: payload.id,
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Step-2: Check the user is deleted or not
  const isUserDeleted = isUserExists?.isDeleted;

  if (isUserDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is deleted, please contact with admin',
    );
  }

  //  Step-3: Check the user is blocked or not
  const userStatus = isUserExists?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is blocked, please contact with admin',
    );
  }

  // Step-4: Check the password is correct or not
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists?.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

*/
