import { PrismaClient } from '@prisma/client';
import { safeTransaction } from './safeTransaction';
const prisma = new PrismaClient();

async function updateUser2First() {
  await prisma.$transaction(async (tx) => {
    // Lock User2 first
    await tx.user.update({
      where: { email: "user2@example.com" },
      data: { role: "ADMIN" },
    });

    await new Promise((res) => setTimeout(res, 3000)); // delay

    // Now try to update User1
    await tx.user.update({
      where: { email: "user1@example.com" },
      data: { role: "USER" },
    });
  });
}

safeTransaction(updateUser2First);
