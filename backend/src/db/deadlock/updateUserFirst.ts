import { PrismaClient } from '@prisma/client';
import { safeTransaction } from './safeTransaction';

const prisma = new PrismaClient();

async function updateUser1First() {
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: "user1@example.com" },
      data: { role: "MODERATOR" },
    });

    await new Promise((res) => setTimeout(res, 3000));

    await tx.user.update({
      where: { email: "user2@example.com" },
      data: { role: "USER" },
    });
  });
}

safeTransaction(updateUser1First);
