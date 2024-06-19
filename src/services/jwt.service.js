import jwt from 'jsonwebtoken';
import config from '@/config/app.config';
import { Unauthorized } from '@/response/error.response';

export default class JwtService {
  static generateToken = (data, accessToken = true, secret = config.jwt.secret) => {
    let expires;
    if (accessToken)
      expires = config.jwt.accessExpiration;
    else
      expires = config.jwt.refreshExpiration;
    const token = jwt.sign(data, secret, { expiresIn: expires });
    return token;
  };

  static verifyToken = (token) => {
    let payload;
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        throw new Unauthorized();
      }
      payload = decoded;
    });
    return payload;
  };
}
