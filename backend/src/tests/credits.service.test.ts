import { CreditsService } from '../services/credits.service';
import prisma from '../config/database';
import { createUser } from './factories/user.factory';

const creditsService = new CreditsService();

describe('CreditsService', () => {
    // ── getBalance ────────────────────────────────────────────────────────

    describe('getBalance', () => {
        it('returns credit balance for existing user', async () => {
            const user = await createUser({ credits: 42 });

            const balance = await creditsService.getBalance(user.id);

            expect(balance).toBeDefined();
            expect(balance?.credits).toBe(42);
            expect(balance?.plan).toBe('FREE');
        });

        it('returns null for non-existent user', async () => {
            const balance = await creditsService.getBalance('non-existent-id');
            expect(balance).toBeNull();
        });
    });

    // ── getHistory ────────────────────────────────────────────────────────

    describe('getHistory', () => {
        it('returns credit transaction history', async () => {
            const user = await createUser();
            await prisma.creditTransaction.createMany({
                data: [
                    { userId: user.id, amount: 10, type: 'SIGNUP_BONUS', description: 'Bonus', balanceAfter: 10 },
                    { userId: user.id, amount: -1, type: 'USAGE', description: 'Used', balanceAfter: 9 },
                ],
            });

            const result = await creditsService.getHistory(user.id, {});

            expect(result.data).toHaveLength(2);
            expect(result.total).toBe(2);
        });

        it('filters by transaction type', async () => {
            const user = await createUser();
            await prisma.creditTransaction.createMany({
                data: [
                    { userId: user.id, amount: 10, type: 'SIGNUP_BONUS', description: 'Bonus', balanceAfter: 10 },
                    { userId: user.id, amount: -1, type: 'USAGE', description: 'Used', balanceAfter: 9 },
                ],
            });

            const result = await creditsService.getHistory(user.id, { type: 'usage' });

            expect(result.data).toHaveLength(1);
            expect(result.data[0].type).toBe('USAGE');
        });

        it('respects pagination', async () => {
            const user = await createUser();
            const transactions = Array.from({ length: 5 }, (_, i) => ({
                userId: user.id,
                amount: -1,
                type: 'USAGE' as const,
                description: `Usage ${i}`,
                balanceAfter: 10 - i,
            }));
            await prisma.creditTransaction.createMany({ data: transactions });

            const page1 = await creditsService.getHistory(user.id, { page: 1, limit: 2 });

            expect(page1.data).toHaveLength(2);
            expect(page1.totalPages).toBe(3);
        });

        it('only returns transactions for the requesting user', async () => {
            const userA = await createUser();
            const userB = await createUser();

            await prisma.creditTransaction.create({
                data: { userId: userA.id, amount: 5, type: 'REFERRAL', description: 'Ref', balanceAfter: 15 },
            });

            const result = await creditsService.getHistory(userB.id, {});
            expect(result.data).toHaveLength(0);
        });
    });

    // ── applyReferral ─────────────────────────────────────────────────────

    describe('applyReferral', () => {
        it('applies a referral code and awards credits to both users', async () => {
            const referrer = await createUser({ credits: 10 });
            const newUser = await createUser({ credits: 10 });

            const result = await creditsService.applyReferral(newUser.id, referrer.referralCode!);

            expect(result.success).toBe(true);
            expect(result.creditsEarned).toBe(5);

            const updatedReferrer = await prisma.user.findUnique({ where: { id: referrer.id } });
            expect(updatedReferrer?.credits).toBe(15);

            const updatedNew = await prisma.user.findUnique({ where: { id: newUser.id } });
            expect(updatedNew?.credits).toBe(15);
        });

        it('returns 404 when referral code is invalid', async () => {
            const user = await createUser();

            const result = await creditsService.applyReferral(user.id, 'INVALID00');
            expect(result.success).toBe(false);
            expect(result.status).toBe(404);
        });

        it('prevents using your own referral code', async () => {
            const user = await createUser();

            const result = await creditsService.applyReferral(user.id, user.referralCode!);
            expect(result.success).toBe(false);
            expect(result.status).toBe(400);
        });

        it('prevents applying a referral code twice', async () => {
            const referrer = await createUser();
            const user = await createUser();

            await creditsService.applyReferral(user.id, referrer.referralCode!);
            const secondAttempt = await creditsService.applyReferral(user.id, referrer.referralCode!);

            expect(secondAttempt.success).toBe(false);
            expect(secondAttempt.status).toBe(400);
        });
    });

    // ── getCosts ──────────────────────────────────────────────────────────

    describe('getCosts', () => {
        it('returns a credit cost map', () => {
            const costs = creditsService.getCosts();

            expect(costs).toHaveProperty('CREATE_RESUME');
            expect(costs).toHaveProperty('ATS_SCORE');
            expect(costs).toHaveProperty('GENERATE_COVER_LETTER');
            expect(costs).toHaveProperty('GENERATE_INTERVIEW');

            // All costs should be positive numbers
            Object.values(costs).forEach((cost) => {
                expect(typeof cost).toBe('number');
                expect(cost).toBeGreaterThan(0);
            });
        });
    });
});
