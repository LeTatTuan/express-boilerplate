import Joi from 'joi';
import { pick } from '@/utils/function.js'
import { ErrorResponse } from '@/response/error.response';
import { statusCodes } from '@/response/httpResponse';

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);

    if (error) {
        const details = error.details.map((detail) => detail.message);
        return next(
            new ErrorResponse(details, statusCodes.BAD_REQUEST),
        );
    }
    Object.assign(req, value);
    return next();
};

export default validate;