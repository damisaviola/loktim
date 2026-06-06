import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.job.findMany();
  let updatedCount = 0;
  for (const job of jobs) {
    if (job.requirements && job.requirements.length === 1) {
      const reqString = job.requirements[0];
      if (reqString.includes('Persyaratan')) {
        console.log(`Fixing job ${job.id}:`, reqString);
        
        // Remove "Persyaratan (Requirements) *" if it's there
        let cleaned = reqString.replace(/Persyaratan \(Requirements\) \*/gi, '');
        cleaned = cleaned.replace(/Persyaratan \(Requirements\)/gi, '');
        
        // Split by "." followed by a capital letter, e.g., "sederajat.Memiliki" -> "sederajat." and "Memiliki"
        const splitRegex = /(?<=\.)\s*(?=[A-Z])/;
        const newReqs = cleaned.split(splitRegex).map(r => r.trim().replace(/^\*+/, '').trim()).filter(r => r.length > 0);
        
        console.log(`New reqs for ${job.id}:`, newReqs);
        
        await prisma.job.update({
          where: { id: job.id },
          data: { requirements: newReqs }
        });
        updatedCount++;
      }
    }
  }
  console.log(`Fixed ${updatedCount} jobs.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
