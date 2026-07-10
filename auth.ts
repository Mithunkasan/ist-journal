// @ts-nocheck

import NextAuth from "next-auth";
import authConfig from "./auth.config";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUserById } from "./lib/user";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
