const { generateToken, verifyToken } = require('../../src/utils/token.js');
const jwt = require('jsonwebtoken');

describe('Token Util', () => {
    describe('generateToken', () => {
        it('should generate a token', async () => {
            jest.spyOn(jwt, 'sign').mockReturnValue('token');
            const token = await generateToken('test');
            expect(token).toBe(token);
        });
    });
    describe('verifyToken', () => {
        it('should verify a token', async () => {
            const token = await generateToken('test');
            const decoded = await verifyToken(token);
            expect(decoded).not.toBe(null);
        });
    });
});
