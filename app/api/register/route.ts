import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureUserProfile } from "@/lib/workflow";
import { UserRole, UserStatus } from "@prisma/client";

const publicSelfRegisterRoles = new Set<UserRole>([
  UserRole.AUTHOR,
  UserRole.REVIEWER,
]);

function getAllowedCreatedRole(sessionRole: UserRole | undefined, requestedRole: UserRole) {
  if (!sessionRole) {
    return publicSelfRegisterRoles.has(requestedRole) ? requestedRole : null;
  }

  if (sessionRole === UserRole.ADMIN && requestedRole === UserRole.EDITOR) {
    return requestedRole;
  }

  if (
    sessionRole === UserRole.EDITOR &&
    (requestedRole === UserRole.ASSOCIATE_EDITOR || requestedRole === UserRole.REVIEWER)
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

  const requestedRole = String(role).toUpperCase() as UserRole;
  if (!Object.values(UserRole).includes(requestedRole)) {
    return new NextResponse("Invalid role", { status: 400 });
  }

  const sessionRole = session?.user?.role as UserRole | undefined;
  const allowedRole = getAllowedCreatedRole(sessionRole, requestedRole);
  if (!allowedRole) {
    return new NextResponse("This role cannot be registered from here", { status: 403 });
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (exist) {
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
      email: email.toLowerCase(),
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

  return NextResponse.json(user);
}
