import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureUserProfile } from "@/lib/workflow";
import { UserRole, UserStatus } from "@prisma/client";
import { sendEmailNotification } from "@/lib/mail";

const publicSelfRegisterRoles = new Set<UserRole>([
  UserRole.AUTHOR,
  UserRole.REVIEWER,
]);

function getAllowedCreatedRole(sessionRole: UserRole | undefined, requestedRole: UserRole) {
  if (!sessionRole) {
    return publicSelfRegisterRoles.has(requestedRole) ? requestedRole : null;
  }

  if (sessionRole === UserRole.ADMIN) {
    if (
      requestedRole === UserRole.ADMIN ||
      requestedRole === UserRole.EDITOR ||
      requestedRole === UserRole.REVIEWER ||
      requestedRole === UserRole.AUTHOR ||
      requestedRole === UserRole.ASSOCIATE_EDITOR ||
      requestedRole === UserRole.GUEST_EDITOR
    ) {
      return requestedRole;
    }
  }

  if (sessionRole === UserRole.EDITOR &&
    (requestedRole === UserRole.ASSOCIATE_EDITOR || 
     requestedRole === UserRole.REVIEWER || 
     requestedRole === UserRole.GUEST_EDITOR)
  ) {
    return requestedRole;
  }

  return null;
}

export async function POST(request: any) {
  const session = await auth();
  const body = await request.json();
  const {
    name,
    email,
    password,
    role,
    university,
    qualification,
    areaOfExpertise,
  } = body;

  if (!name || !email || !password || !role) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  if (password.length < 8) {
    return new NextResponse("Password must be at least 8 characters long.", { status: 400 });
  }
  if (!/[A-Z]/.test(password)) {
    return new NextResponse("Password must contain at least one uppercase letter (A-Z).", { status: 400 });
  }
  if (!/[0-9]/.test(password)) {
    return new NextResponse("Password must contain at least one number (0-9).", { status: 400 });
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return new NextResponse("Password must contain at least one special character.", { status: 400 });
  }

  let roleStr = String(role).toUpperCase();
  if (roleStr === "USER") {
    roleStr = "AUTHOR";
  }
  let requestedRole = roleStr as UserRole;
  if (requestedRole === UserRole.EDITOR) {
    requestedRole = UserRole.ASSOCIATE_EDITOR;
  }
  if (!Object.values(UserRole).includes(requestedRole)) {
    return new NextResponse("Invalid role", { status: 400 });
  }

  const sessionRole = session?.user?.role as UserRole | undefined;
  const allowedRole = getAllowedCreatedRole(sessionRole, requestedRole);
  if (!allowedRole) {
    return new NextResponse("This role cannot be registered from here", { status: 403 });
  }

  const exist = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      role: allowedRole,
    },
  });

  if (exist) {
    if (allowedRole === UserRole.AUTHOR) {
      return new NextResponse("Email already registered as an Author", { status: 409 });
    }
    if (allowedRole === UserRole.REVIEWER) {
      return new NextResponse("Email already registered as a Reviewer", { status: 409 });
    }
    return new NextResponse("Email already exists", { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userStatus =
    !sessionRole && allowedRole === UserRole.REVIEWER
      ? UserStatus.IN_ACTIVE
      : UserStatus.ACTIVE;

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      role: allowedRole,
      password: hashedPassword,
      university,
      qualification,
      areaOfExpertise,
      Status: userStatus,
      createdDate: new Date(),
    },
  });

  if (userStatus === UserStatus.ACTIVE) {
    await ensureUserProfile(user.id, allowedRole);
  }

  try {
    await sendEmailNotification({
      to: user.email!,
      subject: "Welcome to IST Online Journal - Your Account Credentials",
      body: `Hello ${name},\n\nWelcome to IST Online Journal! Your account has been registered successfully.\n\nHere are your login credentials:\nEmail: ${email}\nPassword: ${password}\n\nThank you,\nIST Online Journal Editorial Board`,
    });
  } catch (emailErr) {
    console.error("Failed to send welcome email:", emailErr);
  }

  return NextResponse.json(user);
}
