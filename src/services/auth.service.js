import User from '@/models/User.js';
import Role from '@/models/Role.js';
import config from '@/config/app.config';
import { BadRequestError } from '@/response/error.response.js';
import { ROLES } from '@/enum/role.enum.js';
import Token from '@/models/Token.js';
import JwtService from './jwt.service.js';
import { pick } from '@/utils/function.js'

// Role.insertMany([{ name: 'user' }, { name: 'admin' }, { name: 'moderator' }]);
class AuthService {
  static checkExistingUser = async (username, email) => {
    const usernameAlreadyExists = await User.findOne({ username });
    if (usernameAlreadyExists) throw new BadRequestError('Username is already!');

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) throw new BadRequestError('Email is already!');
  };

  static checkExistingRole = (roles) => {
    for (let i = 0; i < roles.length; i++) {
      if (!ROLES.includes(roles[i])) {
        throw new BadRequestError(`Role ${roles[i]} does not exist`);
      }
    }
  };

  static register = async (userDto) => {
    const { username, email, password, roles, userAgent, ip } = userDto;
    await this.checkExistingUser(username, email);
    this.checkExistingRole(roles);

    let userRoles;
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      userRoles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: 'user' });
      userRoles = [role._id];
    }

    let userCreated = await User.create({
      username,
      email,
      password,
      roles: userRoles,
    });

    const accessToken = JwtService.generateToken(pick(userCreated, ['_id', 'roles']));

    const refreshToken = JwtService.generateToken(pick(userCreated, ['_id']), false);

    const userToken = {
      accessTokens: [accessToken],
      refreshToken,
      ip,
      userAgent,
      user: userCreated._id,
    };

    await Token.create(userToken);
    return { access_token: accessToken, refresh_token: refreshToken };
  };

  static login = async (userDto) => {
    const { email, password, userAgent, ip } = userDto;

    let user = await User.findOne({ $or: [{ email: email }] }).populate('roles');
    if (!user) throw new BadRequestError('Invalid Credentials');

    const isMatchPassword = await user.comparePassword(password);
    if (!isMatchPassword) throw new BadRequestError('Invalid Credentials');

    const accessToken = JwtService.generateToken(pick(userCreated, ['_id', 'roles']));

    const userToken = await Token.findOne({ user: user._id });
    let refreshToken = '';
    if (userToken) {
      let oldTokens = userToken.accessTokens || [];
      if (oldTokens.length) {
        oldTokens = oldTokens.filter((t) => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 86400) {
            return t;
          }
        });
      }

      await Token.findByIdAndUpdate(userToken._id, {
        accessTokens: [...oldTokens, accessToken],
      });
      refreshToken = userToken.refreshToken;
      return { user, accessToken, refreshToken };
    } else {
      refreshToken = JwtService.generateToken(pick(userCreated, ['_id']));

      const userTokenNew = {
        accessTokens: [accessToken],
        refreshToken,
        userAgent,
        ip,
        user: user._id,
      };

      await Token.create(userTokenNew);
    }
    return { access_token: accessToken, refresh_token: refreshToken };
  };

  static logout = async (req, res) => {
    await Token.findOneAndDelete({ user: req.user._id });
  };
}

export default AuthService;
