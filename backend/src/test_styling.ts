import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create a dummy user
  const user = await prisma.user.create({
    data: {
      email: `test_styling_${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'Styling',
      password: 'password123',
    }
  });

  console.log('User created:', user.id);

  // 2. Create a resume with styling
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: 'Styling Test Resume',
      template: 'modern',
      styling: {
        font: 'Roboto',
        accentColor: '#3498db',
        spacing: 'compact'
      }
    }
  });

  console.log('Resume created with styling:', JSON.stringify(resume.styling));

  // 3. Fetch to confirm
  const fetched = await prisma.resume.findUnique({
    where: { id: resume.id }
  });

  console.log('Fetched styling:', JSON.stringify(fetched?.styling));

  // 4. Update the styling via the service? Or just direct DB update
  const updated = await prisma.resume.update({
    where: { id: resume.id },
    data: {
      styling: {
        font: 'Inter',
        accentColor: '#e74c3c'
      }
    }
  });

  console.log('Updated styling:', JSON.stringify(updated.styling));

  // cleanup
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Cleanup done.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
