import Project from '@/models/Project';

class projectService {
    static getProjects = async () => {
        const projects = await Project.find({});
        return { projects };
    };
}

export default projectService;
