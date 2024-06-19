import Joi from 'joi';

const EMAIL_FORMAT = /^.*@.*\.(com|net|org)$/;
const PWD_FORMAT = /^.*(?=.{6,50})(?=.*\d)(?=.*[A-Z]).*$/;
const FULL_NAME_FORMAT = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

export class JoiUtils {
    static fullName = () => {
        return Joi.string().pattern(FULL_NAME_FORMAT).required().messages({
            'string.pattern.base': "Full name must contain only letters, spaces, and characters such as , . - '",
        });
    };

    static email = () => {
        return Joi.string().required().pattern(EMAIL_FORMAT).messages({
            'string.pattern.base':
                'Email must be in a valid format (e.g., user@example.com, user@example.net, user@example.org)',
        });
    };

    static password = () => {
        return Joi.string().required().pattern(PWD_FORMAT).messages({
            'string.pattern.base':
                'Password must be 6-50 characters long, contain at least one digit, and one uppercase letter.',
        });
    };

    static confirmPassword = () => {
        return Joi.string().required().valid(Joi.ref('password')).messages({
            'any.only': 'Confirm password must match the password',
        });
    };
}