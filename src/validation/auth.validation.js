import Joi from 'joi';
import { JoiUtils } from '@/utils/joi.util';

export const register = {
    body: Joi.object().keys({
        username: Joi.string().required().trim(),
        email: JoiUtils.email(),
        password: JoiUtils.password(),
        confirm_password: JoiUtils.confirmPassword(),
        roles: Joi.array(),
    }),
};

export const login = {
    body: Joi.object().keys({
        email: JoiUtils.email(),
        password: Joi.string().required().trim(),
    }),
};