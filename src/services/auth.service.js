import User from "@/models/User.js";
import Role from "@/models/Role.js";
import { BadRequestError } from "@/response/error.response.js";
import { ROLES } from "@/enum/role.enum.js";
import Token from "@/models/Token.js";
import jwtService from "./jwt.service.js";


class authService {
    static checkExistingUser = async (username, email) => {
        const usernameAlreadyExists = await User.findOne({ username });
        if (usernameAlreadyExists) throw new BadRequestError('Username is already!');

        const emailAlreadyExists = await User.findOne({ email });
        if (emailAlreadyExists) throw new BadRequestError('Email is already!')
    }

    static checkExistingRole = (roles) => {
        for (let i = 0; i < roles.length; i++) {
            if (!ROLES.includes(roles[i])) {
                throw new BadRequestError(`Role ${roles[i]} does not exist`)
            }
        }
    };
    static register = async (userDto) => {
        const { username, email, password, roles, userAgent, ip } = userDto;
        if (!username || !email || !password || !roles) throw new BadRequestError('Invalid information to register!');
        await this.checkExistingUser(username, email);
        this.checkExistingRole(roles);

        let userRoles;
        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            userRoles = foundRoles.map((role) => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            userRoles = [role._id];
        }

        let userCreated = await User.create({
            username,
            email,
            password,
            roles: userRoles
        });

        const accessToken = jwtService.createToken(userCreated);

        const refreshToken = jwtService.createToken(userCreated, false)

        const userToken = {
            accessTokens: [{ accessToken, signedAt: Date.now().toString() }],
            refreshToken,
            ip,
            userAgent,
            user: userCreated._id
        };
        userCreated.password = null;

        await Token.create(userToken);
        return { user: userCreated, accessToken, refreshToken };
    }


    static login = async (userDto) => {
        const { email, password, userAgent, ip } = userDto;
        if (!email || !password) throw new BadRequestError('Please provide email/username amd password!');

        let user = await User.findOne({ $or: [{ email: email }, { username: email }] }).populate(
            "roles"
        );

        if (!user)
            throw new BadRequestError('Invalid Credentials');

        const isMatchPassword = await user.comparePassword(password);

        if (!isMatchPassword)
            throw new BadRequestError('Invalid Credentials');
        user.password = null;

        const accessToken = jwtService.createToken(user);

        const userToken = await Token.findOne({ user: user._id });
        let refreshToken = '';
        if (userToken) {
            let oldTokens = userToken.accessTokens || [];
            if (oldTokens.length) {
                oldTokens = oldTokens.filter(t => {
                    const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
                    if (timeDiff < 86400) {
                        return t;
                    }
                });
            }
          
            await Token.findByIdAndUpdate(userToken._id, {
                accessTokens: [...oldTokens, { accessToken, signedAt: Date.now().toString() }],
            });
            refreshToken = userToken.refreshToken;
            return {user, accessToken, refreshToken};
        } else {
            refreshToken = jwtService.createToken(user, false);

            const userTokenNew = {
                accessTokens: [{ accessToken, signedAt: Date.now().toString() }],
                refreshToken,
                userAgent,
                ip,
                user: user._id
            };
    
            await Token.create(userTokenNew);
        }
        return {user, accessToken, refreshToken};
    }

    static logout = async (req, res) => {
        await Token.findOneAndDelete({ user: req.user.userId });
    }
}

export default authService;