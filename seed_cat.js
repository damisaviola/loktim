const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = [
    'Pertambangan',
    'Teknik & Engineering',
    'Operasional',
    'Admin & HR',
    'IT & Software',
    'F&B',
    'Pelayanan',
    'Logistik',
    'Desain/Kreatif'
  ];
  for (const c of cats) {
    await prisma.category.upsert({
      where: { name: c },
      update: {},
      create: { name: c }
    });
  }
  console.log('Seeded');
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
