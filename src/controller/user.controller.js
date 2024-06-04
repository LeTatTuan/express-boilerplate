import { SuccessResponse } from '@/response/success.response.js';
import userService from '@/services/user.service';

class userController {
  static getInfo = async (req, res) => {
    const id = req.user?.userId;
    new SuccessResponse({
      message: 'get my information success',
      metadata: await userService.getInfo(id),
    }).send(res);
  };
}
export default userController;
