import User from '@/models/User';

class userService {
  static getInfo = async (id) => {
    let user = await User.findById(id).populate('roles');
    user.password = null;
    return { user };
  };
}

export default userService;
