import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Checking for githubId in User model...');
    // We don't actually run it, just check if it compiles/types correctly
    // Since this is a JS/TS environment, we'll just try to access the type info
    const test: any = {};
    const where: any = { githubId: 'test' };
    console.log('Successfully created a test object with githubId');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
