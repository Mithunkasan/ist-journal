import NextAuth from "next-auth";
import authConfig from "./auth.config";
const { auth } = NextAuth(authConfig);

import {
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_ASSOCIATE_EDITOR_REDIRECT,
  DEFAULT_GUEST_EDITOR_REDIRECT,
  DEFAULT_EDITOR_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REVIEWER_REDIRECT,
  DEFAULT_AUTHOR_REDIRECT,
  adminRoutes,
  editorRoutes,
  authorRoutes,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  reviewerRoutes,
  associateEditorRoutes,
  guestEditorRoutes,
} from "@/routes";

// export default auth(async (req) => {
//   const { nextUrl } = req;
//   console.log("🔄 Middleware triggered for:", nextUrl.pathname);

//   const isLoggedIn = !!req.auth;
//   const token = await getToken({
//     req,
//     secret: process.env.AUTH_SECRET,
//     raw: true,
//   });

//   const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
//   const isAuthCallback = nextUrl.pathname.startsWith("/api/auth/callback");
  
//   const isPublicRoute = publicRoutes.some((route) =>
//     nextUrl.pathname.startsWith(route)
//   );

//   if (isApiAuthRoute || isAuthCallback) return;

//   if (!isLoggedIn && !isPublicRoute) {
//     const encodedCallbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
//     return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
//   }

//   return;
// });

// export const config = {
//   matcher: [
//     "/((?!_next|favicon.ico|api/auth).*)",
//   ],
// };


export default auth(async (req) => {
  const { nextUrl } = req;
  console.log("MIDDLEWARE AUTH OBJECT:", JSON.stringify(req.auth));
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.some((route) =>
    route === "/" ? nextUrl.pathname === "/" : nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  // Is this a callback from authentication?
  const isAuthCallback = nextUrl.pathname.startsWith("/api/auth/callback");
  
  // Check if current path starts with any of these route patterns
  const isAdminPath = nextUrl.pathname.startsWith("/admin");
  const isEditorPath = nextUrl.pathname.startsWith("/editor");
  const isReviewerPath = nextUrl.pathname.startsWith("/reviewer");
  const isAssociateEditorPath = nextUrl.pathname.startsWith("/associate-editor");
  const isGuestEditorPath = nextUrl.pathname.startsWith("/guest-editor");
  const isAuthorPath = nextUrl.pathname.startsWith("/author");

  // API Authentication routes and callbacks bypass
  if (isApiAuthRoute || isAuthCallback) {
    return;
  }

  // Handle auth routes (login/register)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect based on role if user is already logged in
      const userRole = req.auth?.user?.role;
      switch (userRole) {
        case "ADMIN":
          return Response.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
        case "EDITOR":
          return Response.redirect(new URL(DEFAULT_EDITOR_REDIRECT, nextUrl));
        case "REVIEWER":
          return Response.redirect(new URL(DEFAULT_REVIEWER_REDIRECT, nextUrl));
        case "AUTHOR":
          return Response.redirect(new URL(DEFAULT_AUTHOR_REDIRECT, nextUrl));
        case "ASSOCIATE_EDITOR":
          return Response.redirect(new URL(DEFAULT_ASSOCIATE_EDITOR_REDIRECT, nextUrl));
        case "GUEST_EDITOR":
          return Response.redirect(new URL(DEFAULT_GUEST_EDITOR_REDIRECT, nextUrl));
        default:
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); 
      }
    }
    return;
  }

  // Protected routes - redirect to login if not authenticated
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    
    // Redirect to /admin if it's an admin path, /editor-login if it's an editor path, otherwise to /login
    const redirectUrl = isAdminPath ? "/admin" : (isEditorPath ? "/editor-login" : "/login");
    return Response.redirect(new URL(`${redirectUrl}?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // Role-based access control for protected routes
  if (isLoggedIn && !isPublicRoute) {
    const userRole = req.auth?.user?.role;
    
    // Role-based route protection
    if (isAdminPath && userRole !== "ADMIN") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
    
    if (isEditorPath && userRole !== "EDITOR") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
    
    if (isReviewerPath && userRole !== "REVIEWER") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
    
    if (isAssociateEditorPath && userRole !== "ASSOCIATE_EDITOR") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }

    if (isGuestEditorPath && userRole !== "GUEST_EDITOR") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }

    if (isAuthorPath && userRole !== "AUTHOR") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: [
    // Skip all static files, image optimization, favicon, uploads, and APIs
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|cvs|.*\\..*$).*)",
  ],
};
