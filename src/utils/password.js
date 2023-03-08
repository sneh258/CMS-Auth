var bcrypt = require('bcryptjs');

const encryptPassword = async (password) => {
    const newEncryptedPassword = await bcrypt.hash(password, 10);
    return newEncryptedPassword;
};
const checkEncryptedPassword = async (encryptedPassword, password) => {
    let isSame = await bcrypt.compare(password, encryptedPassword);
    return isSame;
};
module.exports = { encryptPassword, checkEncryptedPassword };
