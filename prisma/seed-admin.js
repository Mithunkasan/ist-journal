const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@mattengg.com";
  const password = "Matt@4321admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: {
      email_role: {
        email: email,
        role: "ADMIN",
      },
    },
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

  // 1. Migrate existing editors (except chiefeditor@ist.com) to ASSOCIATE_EDITOR
  const editors = await prisma.user.findMany({
    where: {
      role: "EDITOR",
      NOT: {
        email: "chiefeditor@ist.com"
      }
    }
  });

  for (const editor of editors) {
    await prisma.user.update({
      where: { id: editor.id },
      data: { role: "ASSOCIATE_EDITOR" }
    });

    await prisma.associateEditor.upsert({
      where: { userId: editor.id },
      update: {},
      create: { userId: editor.id }
    });

    try {
      await prisma.editor.delete({
        where: { userId: editor.id }
      });
    } catch (e) {
      // Profile might not exist
    }

    console.log("Converted editor to Associate Editor:", editor.email);
  }

  // 2. Create default Chief Editor
  const chiefEmail = "chiefeditor@ist.com";
  const chiefPassword = "Matt@4321admin";
  const chiefHashedPassword = await bcrypt.hash(chiefPassword, 10);

  const chief = await prisma.user.upsert({
    where: {
      email_role: {
        email: chiefEmail,
        role: "EDITOR",
      },
    },
    update: {
      password: chiefHashedPassword,
      role: "EDITOR",
      Status: "ACTIVE",
    },
    create: {
      email: chiefEmail,
      password: chiefHashedPassword,
      name: "Chief Editor",
      role: "EDITOR",
      Status: "ACTIVE",
    },
  });

  await prisma.editor.upsert({
    where: { userId: chief.id },
    update: {},
    create: { userId: chief.id }
  });

  console.log("Chief Editor created/updated:", chief.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
