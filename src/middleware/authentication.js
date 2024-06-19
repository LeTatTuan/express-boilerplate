import jwtService from '@/services/jwt.service';
import Token from '@/models/Token';
import { Unauthorized } from '@/response/error.response';
import { ROLES } from '@/enum';

export const authenticateUser = async (req, res, next) => {
  let accessToken, refreshToken;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    accessToken = authHeader.split(' ')[1];
  } else {
    throw new Unauthorized('Authentication Invalid');
  }

  try {
    if (accessToken) {
      const payload = jwtService.isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = jwtService.isTokenValid(refreshToken, false);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new Unauthorized('Authentication Invalid');
    }

    req.user = payload.user;
    next();
  } catch (error) {
    throw new Unauthorized('Authentication Invalid');
  }
};

export const authorizePermissions = (req, res, next) => {
  const roles = req.user.roles;
  roles.some((role) => {
    if (!ROLES.includes(role.name)) throw new Unauthorized('Unauthorized to access this route');
  });
  next();
};
