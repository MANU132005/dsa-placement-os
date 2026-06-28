const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const testEmail = 'smoke_test_user@example.com';
  const existing = await prisma.user.findUnique({ where: { email: testEmail } });
  if (existing) {
    console.log('Cleaning existing test user...');
    await prisma.userProgress.deleteMany({ where: { userId: existing.id } }).catch(() => {});
    await prisma.user.delete({ where: { email: testEmail } });
  }
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.create({ data: { name: 'Smoke Test User', email: testEmail, passwordHash } });
  console.log('Created user ID:', user.id);

  const progress = await prisma.userProgress.create({
    data: {
      userId: user.id,
      problemId: 9999,
      status: 'Green',
      confidence: 5,
      attempts: 1,
      solved: false,
    },
  });
  console.log('Created progress ID:', progress.id);

  const fetched = await prisma.userProgress.findMany({ where: { userId: user.id } });
  console.log('Fetched progress count:', fetched.length);

  await prisma.userProgress.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Cleanup completed.');
}

main()
  .catch(e => console.error('Smoke test error:', e))
  .finally(async () => { await prisma.$disconnect(); });
