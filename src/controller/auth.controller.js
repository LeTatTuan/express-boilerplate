import { RegisterDto } from '@/dto';
import { CREATED, SuccessResponse } from '@/response/success.response.js';
import AuthService from '@/services/auth.service.js';

export default class authController {
  static register = async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const body = { ...req.body, userAgent, ip };

    new CREATED({
      message: 'register success',
      metadata: await AuthService.register(RegisterDto(body)),
    }).send(res);
  };

  static login = async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userDto = { ...req.body, userAgent, ip };
    new SuccessResponse({
      message: 'login success',
      metadata: await AuthService.login(userDto),
    }).send(res);
  };

  static logout = async (req, res) => {
    new SuccessResponse({
      message: 'User logged out',
      metadata: await AuthService.logout(req, res),
    }).send(res);
  };
}
