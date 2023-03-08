const UserService = require('../services/user');
const HTTPError = require('../utils/errors/httpError');

const catchBlockHandler = (error, res) => {
    if (error instanceof HTTPError) {
        res.status(error.code).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserService.createUser(username, password);
        return res
            .status(201)
            .json({ status: 201, data: user, message: 'Succesfully Created User' });
    } catch (error) {
        catchBlockHandler(error, res);
    }
};
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserService.loginUser(username, password);
        return res
            .status(200)
            .json({ status: 200, data: user, message: 'Succesfully Logged in' });
    } catch (error) {
        catchBlockHandler(error, res);
    }
};
const checkTokenValidity = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = await UserService.checkTokenValidity(token);
        return res
            .status(200)
            .json({ status: 200, message: 'Token Verified', data: decodedToken });
    } catch (error) {
        catchBlockHandler(error, res);
    }
};
module.exports = { createUser, loginUser, checkTokenValidity };
