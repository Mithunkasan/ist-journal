/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/api/register",
  "/conference",
  "/archive",
  "/aims-scope",
  "/editorial-board",
  "/indexing",
  "/journal-insights",
  "/announcements",
  "/publish",
  "/submit-paper",
];


/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ["/login", "/register", "/forgot-password", "/admin"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const DEFAULT_ADMIN_REDIRECT = "/admin/dashboard";
export const DEFAULT_EDITOR_REDIRECT = "/editor";
export const DEFAULT_ASSOCIATE_EDITOR_REDIRECT = "/associate-editor/dashboard";
export const DEFAULT_GUEST_EDITOR_REDIRECT = "/guest-editor/dashboard";
export const DEFAULT_REVIEWER_REDIRECT = "/reviewer";
export const DEFAULT_AUTHOR_REDIRECT="/author";


/**
 * Route patterns for role-based access control
 * @type {string[]}
 */
export const adminRoutes = ["/admin/dashboard"];
export const authorRoutes=["/author","/author/dashboard"];
export const editorRoutes = ["/editor", "/editor/dashboard"];
export const reviewerRoutes = ["/reviewer", "/reviewer/dashboard"];
export const associateEditorRoutes = ["/associate-editor", "/associate-editor/dashboard"];
export const guestEditorRoutes = ["/guest-editor", "/guest-editor/dashboard"];
