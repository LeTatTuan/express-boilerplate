export const LoginDto = (body) => ({
    email: body.email,
    password: body.password,
    userAgent: body.userAgent,
    ip: body.ip,
});