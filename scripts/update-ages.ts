import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const jobs = await prisma.job.findMany();
  let updatedCount = 0;

  for (const job of jobs) {
    if (job.ageRange && job.ageRange !== "Bebas" && !job.ageRange.startsWith("Maks.")) {
      const numbers = job.ageRange.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        // Find the maximum number in case it's a range like '18 - 25 Tahun'
        const maxAge = Math.max(...numbers.map(Number));
        const newAgeRange = `Maks. ${maxAge} Tahun`;
        
        await prisma.job.update({
          where: { id: job.id },
          data: { ageRange: newAgeRange }
        });
        updatedCount++;
        console.log(`Updated job ${job.id}: ${job.ageRange} -> ${newAgeRange}`);
      }
    }
  }

  console.log(`Finished updating ${updatedCount} jobs.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
