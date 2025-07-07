import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

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
  // Create and send access token to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // Create and send refresh token to the client
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check the user is exist or not
  const user = await User.isUserExistsByCustomId(userData.userId);

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
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // Hash the new password before storing to the DB
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    {
      new: true,
    },
  );
  return result;
};

const refreshToken = async (token: string) => {
  // Check whether the token is sent from the browser
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  // Check whether the token is valid or not
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  // Check whether the user has the permission to access the resource
  const { userId, iat } = decoded;
  // console.log('decoded:', decoded);

  // check the user is exist or not
  const user = await User.isUserExistsByCustomId(userId);
  // console.log('user:', user);

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

  // Check the password was changed after the JWT was issued
  if (
    user.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChange(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  // Create and send access token to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

const forgetPassword = async (userId: string) => {
  // check the user is exist or not
  const user = await User.isUserExistsByCustomId(userId);
  // console.log('user:', user);

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

  // Create and send token to the User via Reset UI Link
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);
};

const resetPassword = async (
  id: string,
  newPassword: string,
  token: string,
) => {
  // check the user is exist or not
  const user = await User.isUserExistsByCustomId(id);
  // console.log('user:', user);

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

  // Check whether the token is valid or not
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  if (id !== decoded?.userId) {
    throw new AppError(httpStatus.FORBIDDEN, ' Yor are forbidden');
  }

  // Hash the new password before storing to the DB
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    {
      new: true,
    },
  );
  return result;
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
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
