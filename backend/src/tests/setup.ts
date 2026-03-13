import { execSync } from 'child_process';
import prisma from '../config/database';
import { getCacheService } from '../services/cache.service';

beforeAll(async () => {
    try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        await seedTestData();
    } catch (error) {
        process.stderr.write(`Error during test setup: ${String(error)}\n`);
        process.exit(1);
    }
});

afterEach(async () => {
    const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
        .map((row) => row.tablename)
        .filter((name) => name !== '_prisma_migrations')
        .map((name) => `"public"."${name}"`)
        .join(', ');

    if (tables.length > 0) {
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
        } catch {
            // Ignore truncation errors during cleanup
        }
    }

    const cache = getCacheService();
    if (cache.isConnected()) {
        await cache.clear();
    }
});

afterAll(async () => {
    await prisma.$disconnect();
    const cache = getCacheService();
    await cache.disconnect();
});

async function seedTestData(): Promise<void> {
    // Seed test data here when needed
}
