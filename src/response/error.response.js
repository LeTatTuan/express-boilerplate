'use strict';
import { statusCodes, responsePharses } from '@/response/httpResponse';

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = responsePharses.BAD_REQUEST, status = statusCodes.BAD_REQUEST) {
        super(message, status);
    }
}

class Unauthorized extends ErrorResponse {
    constructor(message = responsePharses.UNAUTHORIZED, status = statusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

class Forbidden extends ErrorResponse {
    constructor(message = responsePharses.FORBIDDEN, status = statusCodes.FORBIDDEN) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = responsePharses.NOT_FOUND, status = statusCodes.NOT_FOUND) {
        super(message, status);
    }
}

export {
    ErrorResponse,
    BadRequestError,
    Unauthorized,
    Forbidden,
    NotFoundError,
}