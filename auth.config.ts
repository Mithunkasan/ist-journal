// @ts-nocheck
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import { 
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_EDITOR_REDIRECT,
  DEFAULT_ASSOCIATE_EDITOR_REDIRECT,
  DEFAULT_REVIEWER_REDIRECT
} from "./routes";

export default {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    // Optional: Log successful sign-ins
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
  },
  providers: [
    Credentials({
      async authorize(credentials: { email?: string; password?: string; role?: string }) {
        const email = credentials.email?.trim().toLowerCase();
        const password = credentials.password?.trim();
        const role = credentials.role?.trim().toUpperCase();

        if (!email || !password) {
          throw new Error("Please enter an email and password");
        }

        let user = null;

        // If role is explicitly provided, find the user matching both email and role
        if (role) {
          user = await prisma.user.findFirst({
            where: {
              email,
              role: role as any,
            },
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
              image: true,
              role: true,
              Status: true,
              password: true,
              hashedPassword: true,
            },
          });
        }

        // If no user found yet, find all matching emails and verify password
        if (!user) {
          const users = await prisma.user.findMany({
            where: {
              email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
              image: true,
              role: true,
              Status: true,
              password: true,
              hashedPassword: true,
            },
          });

          for (const u of users) {
            const passwordHash = u.password ?? u.hashedPassword;
            if (passwordHash) {
              const match = await bcrypt.compare(password, passwordHash);
              if (match) {
                user = u;
                break;
              }
            }
          }
        }

        const passwordHash = user?.password ?? user?.hashedPassword;

        // if no user was found
        if (!user || !passwordHash) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[auth] credentials rejected", {
              email,
              reason: !user ? "user_not_found" : "missing_password_hash",
              role: user?.role,
              status: user?.Status,
            });
          }
          return null;
        }

        // check to see if password matches
        const passwordMatch = await bcrypt.compare(
          password,
          passwordHash
        );

        // if password does not match
        if (!passwordMatch) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[auth] credentials rejected", {
              email,
              reason: "password_mismatch",
              role: user.role,
              status: user.Status,
            });
          }
          return null;
        }

        // Check if user is active (only Reviewers require Editor approval before they can log in)
        if (user.Status === "IN_ACTIVE" && user.role === "REVIEWER") {
          if (process.env.NODE_ENV === "development") {
            console.warn("[auth] credentials rejected", {
              email,
              reason: "inactive_reviewer",
              role: user.role,
              status: user.Status,
            });
          }
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Always allow sign in if we get this far
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callbacks and limits redirect to same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
