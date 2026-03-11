import { createUser } from './factories/user.factory';
import prisma from '../config/database';

describe('Test Environment Verification', () => {
    it('should create a user using the factory', async () => {
        const user = await createUser();
        expect(user).toBeDefined();
        expect(user.id).toBeDefined();

        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        expect(dbUser).toBeDefined();
        expect(dbUser?.email).toBe(user.email);
    });
});
