const UserController = require('../controllers/user');
const {
    validationMiddleware,
    userSchema,
} = require('../middlewares/validation');
const Router = require('express').Router;
const router = Router();

router.post(
    '/register',
    validationMiddleware(userSchema),
    UserController.createUser
);
router.post(
    '/login',
    validationMiddleware(userSchema),
    UserController.loginUser
);
router.get('/token/validate', UserController.checkTokenValidity);
module.exports = { router };
