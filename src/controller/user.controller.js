import { SuccessResponse } from "@/response/success.response.js";
import userService from "@/services/user.service";

const userController = {
    getInfo: async (req, res) => {
        const id = req.user?.userId;
        new SuccessResponse({
            message: 'get my information success',
            metadata: await userService.getInfo(id)
        }).send(res);
    }

}
export default userController;