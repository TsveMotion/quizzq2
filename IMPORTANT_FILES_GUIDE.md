# QUIZZQ Project Structure Guide

This document outlines the key files and directories in the QUIZZQ project. Use this as a reference for understanding where important functionality is located.

## Core Configuration Files

- `/lib/auth-config.ts` - NextAuth configuration and authentication setup
- `/lib/prisma.ts` - Prisma client configuration for database access
- `/lib/routes.ts` - Route definitions and role-based routing configuration
- `/middleware.ts` - Authentication and route protection middleware

## Authentication

- `/app/(auth)/signin/page.tsx` - Sign in page component
- `/app/(auth)/signup/page.tsx` - Sign up page component
- `/app/(auth)/layout.tsx` - Layout wrapper for auth pages
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `/app/api/auth/register/route.ts` - User registration API endpoint

## Dashboard Pages

- `/app/dashboard/page.tsx` - Main dashboard router
- `/app/dashboard/layout.tsx` - Common dashboard layout
- `/app/dashboard/superadmin/page.tsx` - SuperAdmin dashboard page
- `/app/dashboard/schooladmin/page.tsx` - SchoolAdmin dashboard page
- `/app/dashboard/teacher/page.tsx` - Teacher dashboard page
- `/app/dashboard/student/page.tsx` - Student dashboard page

## Dashboard Components

### SuperAdmin Components
- `/components/dashboard/SuperAdmin-Tabs/SuperAdminDashboard.tsx` - Main SuperAdmin dashboard component
- `/components/dashboard/SuperAdmin-Tabs/SchoolsTab.tsx` - Schools management tab
- `/components/dashboard/SuperAdmin-Tabs/UsersTab.tsx` - Users management tab

### SchoolAdmin Components
- `/components/dashboard/SchoolAdmin-Tabs/SchoolAdminDashboard.tsx` - Main SchoolAdmin dashboard component
- `/components/dashboard/SchoolAdmin-Tabs/TeachersTab.tsx` - Teachers management tab
- `/components/dashboard/SchoolAdmin-Tabs/StudentsTab.tsx` - Students management tab
- `/components/dashboard/SchoolAdmin-Tabs/ClassesTab.tsx` - Classes management tab
- `/components/dashboard/SchoolAdmin-Tabs/OverviewTab.tsx` - School overview tab

### Teacher Components
- `/components/dashboard/Teacher-Tabs/TeacherDashboard.tsx` - Main Teacher dashboard component
- `/components/dashboard/Teacher-Tabs/ClassesTab.tsx` - Teacher's classes tab
- `/components/dashboard/Teacher-Tabs/StudentsTab.tsx` - Teacher's students tab

### Student Components
- `/components/dashboard/Student-Tabs/StudentDashboard.tsx` - Main Student dashboard component
- `/components/dashboard/Student-Tabs/CoursesTab.tsx` - Student's courses tab
- `/components/dashboard/Student-Tabs/GradesTab.tsx` - Student's grades tab

## API Routes

### Admin Routes
- `/app/api/admin/users/route.ts` - User management API endpoints
- `/app/api/admin/schools/route.ts` - School management API endpoints
- `/app/api/admin/classes/route.ts` - Class management API endpoints
- `/app/api/admin/users/bulk-import-teachers/route.ts` - Bulk import teachers
- `/app/api/admin/users/[id]/route.ts` - Individual user management

### School Routes
- `/app/api/schools/[schoolId]/settings/route.ts` - School settings management
- `/app/api/schools/[schoolId]/stats/route.ts` - School statistics
- `/app/api/schools/[schoolId]/users/route.ts` - School users management
- `/app/api/schools/[schoolId]/users/[userId]/route.ts` - Individual school user management

### Class Routes
- `/app/api/admin/classes/[classId]/teachers/route.ts` - Class teachers management
- `/app/api/admin/classes/[classId]/students/route.ts` - Class students management

## Database

- `/prisma/schema.prisma` - Database schema definition
- `/prisma/migrations/` - Database migration files
- `/prisma/seed.ts` - Database seeding script

## Environment Variables

Required variables in `.env`:
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
JWT_SECRET=
SUPERADMIN_EMAIL=
SUPERADMIN_PASSWORD=
```

## UI Components

- `/components/ui/` - Reusable UI components
- `/components/navbar.tsx` - Main navigation bar
- `/components/UserNav.tsx` - User navigation component
- `/components/ui/button.tsx` - Button component
- `/components/ui/input.tsx` - Input component
- `/components/ui/toast.tsx` - Toast notifications
- `/components/ui/tabs.tsx` - Tab component

## Important Notes

1. Authentication Flow:
   - Users sign in through `/signin`
   - NextAuth handles authentication in `auth-config.ts`
   - Middleware protects routes based on user role
   - Each role has its own dashboard

2. Role Hierarchy:
   - SUPERADMIN: Full system access
   - SCHOOLADMIN: School-specific access
   - TEACHER: Class and student management
   - STUDENT: Learning interface

3. Database Models:
   - User
   - School
   - Class
   - Quiz
   - Question
   - Answer

4. Protected Routes:
   - All `/dashboard/*` routes are protected
   - Role-specific access is enforced
   - Unauthorized access redirects to signin

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Run database migrations: `npx prisma migrate dev`
4. Start development server: `npm run dev`

## Common Tasks

1. Adding a new API endpoint:
   - Create new route in `/app/api/`
   - Add authentication checks
   - Use Prisma client for database operations

2. Creating new dashboard features:
   - Add component in appropriate dashboard folder
   - Update role-based access in middleware
   - Add API endpoints if needed

3. Modifying auth behavior:
   - Update `/lib/auth-config.ts`
   - Modify middleware.ts for route protection
   - Update role-based redirects in routes.ts

4. School Management:
   - Create/Edit schools in SuperAdmin dashboard
   - Manage school settings in SchoolAdmin dashboard
   - View school statistics and performance metrics
