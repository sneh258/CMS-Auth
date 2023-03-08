const Users = require('../../database/models/index').User;
const HTTPError = require('../utils/errors/httpError');
const passwordUtil = require('../utils/password');
const tokenUtil = require('../utils/token');
const { UniqueConstraintError } = require('sequelize');

const createUser = async (username, password) => {
    try {
        const encryptedPassword = await passwordUtil.encryptPassword(password);
        const user = await Users.create({
            username: username,
            password: encryptedPassword,
        });
        return user.dataValues;
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            console.log('Error');
            throw new HTTPError('Username already exists', 400);
        }
        throw new HTTPError(500, 'Internal server error', 500);
    }
};

const loginUser = async (username, password) => {
    const user = await Users.findOne({ where: { username: username } });
    if (!user) throw new HTTPError('User not found', 400);

    const checkIfPasswordIsValid = await passwordUtil.checkEncryptedPassword(
        user.password,
        password
    );
    if (!checkIfPasswordIsValid) throw new HTTPError('Invalid password', 401);
    const newToken = await tokenUtil.generateToken(user.id);
    return { user, token: newToken };
};

const checkTokenValidity = async (token) => {
    const decodedToken = await tokenUtil.verifyToken(token);
    if (!decodedToken) throw new HTTPError('Invalid token', 401);
    return decodedToken;
};

module.exports = { createUser, loginUser, checkTokenValidity };
