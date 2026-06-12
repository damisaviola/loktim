import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.jobReport.deleteMany({ where: { reason: "Test Reason" } });
  console.log("deleted test reports");
}
main();
