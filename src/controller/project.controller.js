import { SuccessResponse } from '@/response/success.response.js';
import projectService from '@/services/project.service';

class projectController {
    static getProjects = async (req, res) => {
        new SuccessResponse({
            message: 'get projects success',
            metadata: await projectService.getProjects(),
        }).send(res);
    };
}
export default projectController;
