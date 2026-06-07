import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const rawPassword = 'adminpassword123'; // The user can change this
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { username }
  });

  if (existingAdmin) {
    console.log(`Admin with username '${username}' already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created successfully:');
  console.log(`Username: ${admin.username}`);
  console.log(`Password: ${rawPassword}`);
  console.log(`(Password has been securely hashed in the database)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
