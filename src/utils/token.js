const jwt = require('jsonwebtoken');
require('dotenv').config();

// const redisClient = require('./redis');

const generateToken = async (id) => {
    let token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // await redisClient.set(token, '');
    return token;
};
const verifyToken = async (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // const tokenInRedis = await redisClient.get(token);
        // if (decodedToken && tokenInRedis != undefined) return decodedToken;
        return decodedToken;
    } catch (error) {
        return false;
    }
};
module.exports = { generateToken, verifyToken };
