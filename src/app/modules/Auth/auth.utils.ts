import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secretKey: string,
  expiresIn: string,
): string => {
  return jwt.sign(jwtPayload, secretKey, {
    expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string, secretKey: string) => {
  return jwt.verify(token, secretKey) as JwtPayload;
};
