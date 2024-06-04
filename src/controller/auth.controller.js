import { CREATED, SuccessResponse } from '@/response/success.response.js';
import authService from '../services/auth.service.js';

export default class authController {
  static register = async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userDto = { ...req.body, userAgent, ip };

    new CREATED({
      message: 'register success',
      metadata: await authService.register(userDto),
    }).send(res);
  };

  static login = async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userDto = { ...req.body, userAgent, ip };
    new SuccessResponse({
      message: 'login success',
      metadata: await authService.login(userDto),
    }).send(res);
  };

  static logout = async (req, res) => {
    new SuccessResponse({
      message: 'User logged out',
      metadata: await authService.logout(req, res),
    }).send(res);
  };
}
