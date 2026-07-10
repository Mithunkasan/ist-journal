const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@mattengg.com";
  const password = "Matt@4321admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      Status: "ACTIVE",
    },
    create: {
      email: email,
      password: hashedPassword,
      name: "Super Admin",
      role: "ADMIN",
      Status: "ACTIVE",
    },
  });

  console.log("Admin user created/updated:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
