import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@akmiuntirta.test" },
    update: {},
    create: {
      name: "Admin AKMI Untirta",
      email: "admin@akmiuntirta.test",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  console.log("Seeded user:", admin.email);
  console.log(
    'Sample login password is "ChangeMe123!" — for local development only, never use this in production.',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
