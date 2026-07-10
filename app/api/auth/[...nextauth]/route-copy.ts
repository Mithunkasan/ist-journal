// @ts-nocheck
import prisma from "@/lib/prisma";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter the Email" },
        password: { label: "Password", type: "password" },
        username: {
          label: "Username",
          type: "text",
          placeholder: "UserName",
        },
      },
      async authorize(credentials: Partial<Record<"email" | "password" | "username", unknown>>, req: Request) {
        if (typeof credentials?.email !== "string" || typeof credentials?.password !== "string") {
          throw new Error("Please enter an email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
            role: true,
            image: true,
            emailVerified: true
          }
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("No user found");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        // Return only the fields that NextAuth expects
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role || undefined // Convert null to undefined if needed
        };
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
