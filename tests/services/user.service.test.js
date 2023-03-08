const { UniqueConstraintError } = require('sequelize');
const AuthService = require('../../src/services/user');
const db = require('../../database/models/index.js').User;
const passwordUtil = require('../../src/utils/password');
const tokenUtil = require('../../src/utils/token');

describe('Auth Service', () => {
    describe('createUser', () => {
        it('should create a user when username and password is valid', async () => {
            const mockUser = {
                id: 1,
                username: 'test1',
                password: 'encryptedPassword',
                createdAt: '2021-03-01T00:00:00.000Z',
                updatedAt: '2021-03-01T00:00:00.000Z',
            };
            jest
                .spyOn(passwordUtil, 'encryptPassword')
                .mockResolvedValue('encryptedPassword');
            jest.spyOn(db, 'create').mockResolvedValue({
                mockUser,
            });
            jest.spyOn(db, 'findOne').mockResolvedValue({
                id: 1,
                username: 'test1',
                createdAt: '2021-03-01T00:00:00.000Z',
                updatedAt: '2021-03-01T00:00:00.000Z',
            });
            const user = await AuthService.createUser('test', 'password');
            expect(user).toEqual(undefined);
        });

        it('should throw an error if username is already taken', async () => {
            jest
                .spyOn(db, 'create')
                .mockRejectedValueOnce(new UniqueConstraintError());
            await expect(AuthService.createUser('test', 'password')).rejects.toEqual(
                expect.objectContaining({ message: 'Username already exists' })
            );
        });
    });
    describe('loginUser', () => {
        const mockUser = {
            id: 1,
            username: 'test2',
            password: 'password',
            createdAt: '2021-03-01T00:00:00.000Z',
            updatedAt: '2021-03-01T00:00:00.000Z',
        };

        it('should return user if username and password is valid', async () => {
            jest.spyOn(db, 'findOne').mockResolvedValue(mockUser);
            jest
                .spyOn(passwordUtil, 'checkEncryptedPassword')
                .mockResolvedValue(true);
            jest.spyOn(tokenUtil, 'generateToken').mockResolvedValue('token');
            const decodedToken = await AuthService.loginUser('test', 'password');
            expect(decodedToken).toEqual({ token: 'token', user: mockUser });
        });

        it('should throw an error if user is not found', async () => {
            jest.spyOn(db, 'findOne').mockResolvedValue(null);
            await expect(AuthService.loginUser('test', 'password')).rejects.toEqual(
                expect.objectContaining({ message: 'User not found' })
            );
        });
    });
    describe('checkTokenValidity', () => {
        it('should return decoded token if token is valid', async () => {
            jest.spyOn(tokenUtil, 'verifyToken').mockResolvedValue({ id: 1 });
            const decodedToken = await AuthService.checkTokenValidity('token');
            expect(decodedToken).toEqual({ id: 1 });
        });
        it('should throw an error if token is invalid', async () => {
            jest.spyOn(tokenUtil, 'verifyToken').mockResolvedValue(null);
            await expect(AuthService.checkTokenValidity('token')).rejects.toEqual(
                expect.objectContaining({ message: 'Invalid token' })
            );
        });
    });
});
