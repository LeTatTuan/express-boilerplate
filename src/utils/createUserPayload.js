const createUserPayload = user => {
    return { username: user.username, userId: user._id, roles: user.roles };
};

export default createUserPayload;
