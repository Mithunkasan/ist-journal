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
    // You can add event handlers here if needed
    async signIn({ user }) {
      // Optional: Log successful sign-ins
      console.log(`User signed in: ${user.email}`);
    },
  },
  providers: [
    Credentials({
      async authorize(credentials: { email?: string; password?: string }) {
        const email = credentials.email?.trim().toLowerCase();
        const password = credentials.password?.trim();

        if (!email || !password) {
          throw new Error("Please enter an email and password");
        }

        // check to see if user exists
        const user = await prisma.user.findUnique({
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
