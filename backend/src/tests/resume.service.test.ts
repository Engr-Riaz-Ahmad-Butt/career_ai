import { ResumeService } from '../services/resume.service';
import prisma from '../config/database';
import { createUser, createUserWithCredits } from './factories/user.factory';
import { createResume } from './factories/resume.factory';

const resumeService = new ResumeService();

describe('ResumeService', () => {
    // ── createResume ──────────────────────────────────────────────────────

    describe('createResume', () => {
        it('creates a resume and deducts 1 credit', async () => {
            const user = await createUserWithCredits(5);

            const resume = await resumeService.createResume(user.id, {
                title: 'My Resume',
                template: 'modern',
            });

            expect(resume.id).toBeDefined();
            expect(resume.title).toBe('My Resume');

            const updated = await prisma.user.findUnique({ where: { id: user.id } });
            expect(updated?.credits).toBe(4);
        });

        it('throws 402 when user has no credits', async () => {
            const user = await createUserWithCredits(0);

            await expect(
                resumeService.createResume(user.id, { title: 'Test', template: 'modern' })
            ).rejects.toMatchObject({ statusCode: 402 });
        });

        it('records a USAGE credit transaction', async () => {
            const user = await createUserWithCredits(5);

            const resume = await resumeService.createResume(user.id, {
                title: 'Transaction Test',
                template: 'classic',
            });

            const tx = await prisma.creditTransaction.findFirst({
                where: { userId: user.id, type: 'USAGE' },
            });
            expect(tx).toBeDefined();
            expect(tx?.amount).toBe(-1);
            expect(tx?.description).toContain(resume.id);
        });
    });

    // ── listResumes ────────────────────────────────────────────────────────

    describe('listResumes', () => {
        it('returns paginated resumes for the correct user', async () => {
            const userA = await createUser();
            const userB = await createUser();

            await createResume(userA.id, { title: 'Resume A1' });
            await createResume(userA.id, { title: 'Resume A2' });
            await createResume(userB.id, { title: 'Resume B1' });

            const result = await resumeService.listResumes(userA.id);

            expect(result.data).toHaveLength(2);
            expect(result.total).toBe(2);
            result.data.forEach((r) => expect(r.title).toMatch(/^Resume A/));
        });

        it('respects pagination parameters', async () => {
            const user = await createUser();
            await Promise.all(
                Array.from({ length: 5 }, (_, i) =>
                    createResume(user.id, { title: `Resume ${i + 1}` })
                )
            );

            const page1 = await resumeService.listResumes(user.id, { page: 1, limit: 2 });
            expect(page1.data).toHaveLength(2);
            expect(page1.totalPages).toBe(3);
        });

        it('throws 400 when userId is missing', async () => {
            await expect(resumeService.listResumes('')).rejects.toMatchObject({ statusCode: 400 });
        });
    });

    // ── getResumeById ──────────────────────────────────────────────────────

    describe('getResumeById', () => {
        it('returns resume for the correct owner', async () => {
            const user = await createUser();
            const resume = await createResume(user.id);

            const found = await resumeService.getResumeById(user.id, resume.id);
            expect(found.id).toBe(resume.id);
        });

        it('throws 404 when resume belongs to another user', async () => {
            const userA = await createUser();
            const userB = await createUser();
            const resume = await createResume(userA.id);

            await expect(
                resumeService.getResumeById(userB.id, resume.id)
            ).rejects.toMatchObject({ statusCode: 404 });
        });

        it('throws 404 for non-existent resume ID', async () => {
            const user = await createUser();

            await expect(
                resumeService.getResumeById(user.id, 'non-existent-id')
            ).rejects.toMatchObject({ statusCode: 404 });
        });
    });

    // ── updateResume ───────────────────────────────────────────────────────

    describe('updateResume', () => {
        it('updates allowed fields and increments version', async () => {
            const user = await createUser();
            const resume = await createResume(user.id, { title: 'Original' });

            const updated = await resumeService.updateResume(user.id, resume.id, {
                title: 'Updated Title',
                summary: 'A great professional',
            });

            expect(updated.title).toBe('Updated Title');
            expect(updated.summary).toBe('A great professional');
            expect(updated.version).toBe(resume.version + 1);
        });

        it('throws 400 for empty update payload', async () => {
            const user = await createUser();
            const resume = await createResume(user.id);

            await expect(
                resumeService.updateResume(user.id, resume.id, {})
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('creates a version snapshot before update', async () => {
            const user = await createUser();
            const resume = await createResume(user.id, { title: 'Before Snapshot' });

            await resumeService.updateResume(user.id, resume.id, { title: 'After Snapshot' });

            const versions = await prisma.resumeVersion.findMany({
                where: { resumeId: resume.id },
            });
            expect(versions).toHaveLength(1);
        });

        it('rejects invalid styling values', async () => {
            const user = await createUser();
            const resume = await createResume(user.id);

            await expect(
                resumeService.updateResume(user.id, resume.id, {
                    styling: { primaryColor: 'notacolor', fontSize: 999 },
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });
    });

    // ── deleteResume ───────────────────────────────────────────────────────

    describe('deleteResume', () => {
        it('deletes an owned resume', async () => {
            const user = await createUser();
            const resume = await createResume(user.id);

            await resumeService.deleteResume(user.id, resume.id);

            const found = await prisma.resume.findUnique({ where: { id: resume.id } });
            expect(found).toBeNull();
        });

        it('throws 404 when deleting another user\'s resume', async () => {
            const userA = await createUser();
            const userB = await createUser();
            const resume = await createResume(userA.id);

            await expect(
                resumeService.deleteResume(userB.id, resume.id)
            ).rejects.toMatchObject({ statusCode: 404 });
        });
    });

    // ── duplicateResume ────────────────────────────────────────────────────

    describe('duplicateResume', () => {
        it('creates a copy with "(Copy)" suffix', async () => {
            const user = await createUser();
            const original = await createResume(user.id, { title: 'My Resume' });

            const copy = await resumeService.duplicateResume(user.id, original.id);

            expect(copy.id).not.toBe(original.id);
            expect(copy.title).toBe('My Resume (Copy)');
        });
    });

    // ── listVersions & restoreVersion ─────────────────────────────────────

    describe('versions', () => {
        it('lists up to 5 versions', async () => {
            const user = await createUser();
            const resume = await createResume(user.id, { title: 'Version Test' });

            // Create 3 updates to generate snapshots
            for (let i = 0; i < 3; i++) {
                await resumeService.updateResume(user.id, resume.id, { title: `Update ${i + 1}` });
            }

            const versions = await resumeService.listVersions(user.id, resume.id);
            expect(versions.length).toBeLessThanOrEqual(5);
            expect(versions.length).toBeGreaterThan(0);
        });
    });
});
