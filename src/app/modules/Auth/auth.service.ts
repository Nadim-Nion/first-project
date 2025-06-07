import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  console.log('Login user service called with payload:', payload);
};

export const AuthServices = {
  loginUser,
};
