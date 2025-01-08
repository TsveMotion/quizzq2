/**
 * Authentication Routes
 */
export const authRoutes = {
  signIn: '/signin',
  signOut: '/signout',
  error: '/error',
} as const;

/**
 * API Routes
 */
export const apiRoutes = {
  // Admin Routes
  admin: {
    users: '/api/admin/users',
    schools: '/api/admin/schools',
    createUser: '/api/admin/users/create',
    updateUser: '/api/admin/users/update',
    deleteUser: '/api/admin/users/delete',
    createSchool: '/api/admin/schools/create',
    updateSchool: '/api/admin/schools/update',
    deleteSchool: '/api/admin/schools/delete',
  },

  // Auth Routes
  auth: {
    signin: '/api/auth/signin',
    signout: '/api/auth/signout',
    session: '/api/auth/session',
  },
} as const;

/**
 * Dashboard Routes
 */
export const dashboardRoutes = {
  root: '/dashboard',
  user: '/dashboard/user',
  superadmin: '/dashboard/superadmin',
  schooladmin: '/dashboard/schooladmin',
  teacher: '/dashboard/teacher',
} as const;

/**
 * Protected Routes Configuration
 */
export const protectedRoutes = {
  // Routes that require authentication
  authenticated: [
    '/dashboard',
    dashboardRoutes.user,
    dashboardRoutes.superadmin,
    dashboardRoutes.schooladmin,
    dashboardRoutes.teacher,
  ],

  // Routes accessible only to specific roles
  roleAccess: {
    SUPERADMIN: [dashboardRoutes.superadmin],
    SCHOOLADMIN: [dashboardRoutes.schooladmin],
    TEACHER: [dashboardRoutes.teacher],
    STUDENT: [dashboardRoutes.user],
  },
} as const;

/**
 * Public Routes
 */
export const publicRoutes = {
  home: '/',
  signin: '/signin',
  signout: '/signout',
} as const;

/**
 * Default Redirects
 */
export const defaultRedirects = {
  afterAuth: '/dashboard',
  afterSignOut: '/',
} as const;

/**
 * Role to Dashboard Mapping
 */
export const roleToDashboard = {
  SUPERADMIN: dashboardRoutes.superadmin,
  SCHOOLADMIN: dashboardRoutes.schooladmin,
  TEACHER: dashboardRoutes.teacher,
  STUDENT: dashboardRoutes.user,
} as const;
