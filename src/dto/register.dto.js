export const RegisterDto = (body) => ({
    username: body.username,
    email: body.email,
    password: body.password,
    roles: body.roles,
    userAgent: body.userAgent,
    ip: body.ip,
});