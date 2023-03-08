const AuthController = require('../../src/controllers/user');
const AuthService = require('../../src/services/user');
const HTTPError = require('../../src/utils/errors/httpError');

describe('Auth Controller', () => {
    describe('createUser', () => {
        it('should return 201 status code when user is successfully created', async () => {
            const req = {
                body: {
                    username: 'test',
                    password: 'test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockUser = {
                id: 1,
                username: 'test',
                password: 'test',
                createdAt: '2021-01-01',
                updatedAt: '2021-01-01',
            };
            AuthService.createUser = jest.fn().mockReturnValue(mockUser);
            await AuthController.createUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                data: mockUser,
                message: 'Succesfully Created User',
                status: 201,
            });
        });

        it('should return 400 status code if user with same username already exists', async () => {
            const req = {
                body: {
                    username: 'test',
                    password: 'test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockError = new HTTPError(
                'User with this username already exists',
                400
            );
            AuthService.createUser = jest.fn().mockRejectedValue(mockError);
            await AuthController.createUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with this username already exists',
            });
        });

        it('should return 500 status code if creating user in database fails', async () => {
            const req = {
                body: {
                    username: 'test',
                    password: 'test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockError = new Error('Error creating user');
            AuthService.createUser = jest.fn().mockRejectedValue(mockError);
            await AuthController.createUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal Server Error',
            });
        });
    });
    describe('loginUser', () => {
        it('should return 200 status code when user is successfully logged in', async () => {
            const req = {
                body: {
                    username: 'test',
                    password: 'test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockUser = {
                id: 1,
                username: 'test',
                password: 'test',
                createdAt: '2021-01-01',
                updatedAt: '2021-01-01',
            };
            AuthService.loginUser = jest.fn().mockReturnValue(mockUser);
            await AuthController.loginUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: mockUser,
                message: 'Succesfully Logged in',
                status: 200,
            });
        });
        it('should return 400 status code if user with given username does not exist', async () => {
            const req = {
                body: {
                    username: 'test',
                    password: 'test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockError = new HTTPError(
                'User with this username does not exist',
                400
            );
            AuthService.loginUser = jest.fn().mockRejectedValue(mockError);
            await AuthController.loginUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User with this username does not exist',
            });
        });
        it('should return 400 status code if password is incorrect', async () => {
            const req = {
                body: {
                    username: 'test',
                    password: 'test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockError = new HTTPError('Password is incorrect', 400);
            AuthService.loginUser = jest.fn().mockRejectedValue(mockError);
            await AuthController.loginUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Password is incorrect',
            });
        });
        it('should return 500 status code if logging in user in database fails', async () => {
            const req = {
                body: {
                    username: 'test',
                    password: 'test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockError = new Error('Error logging in user');
            AuthService.loginUser = jest.fn().mockRejectedValue(mockError);
            await AuthController.loginUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal Server Error',
            });
        });
    });

    describe('checkTokenValidity', () => {
        it('should return 200 status code when token is valid', async () => {
            const req = {
                headers: {
                    authorization: 'Bearer test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            AuthService.checkTokenValidity = jest
                .fn()
                .mockReturnValue({ token: 'test' });
            await AuthController.checkTokenValidity(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                message: 'Token Verified',
                data: { token: 'test' },
            });
        });

        it('should return 401 status code if token is invalid', async () => {
            const req = {
                headers: {
                    authorization: 'Bearer test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            const mockError = new HTTPError('Token is invalid', 401);
            AuthService.checkTokenValidity = jest.fn().mockRejectedValue(mockError);
            await AuthController.checkTokenValidity(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token is invalid' });
        });

        it('should return 500 status code if checking validity of token fails', async () => {
            const req = {
                headers: {
                    authorization: 'Bearer test',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const next = jest.fn();
            AuthService.checkTokenValidity = jest.fn().mockRejectedValue();
            await AuthController.checkTokenValidity(req, res, next);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal Server Error',
            });
        });
    });
});
