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

### School Management
- `/app/api/admin/schools/route.ts` - School management API endpoints
- `/app/api/schools/[schoolId]/settings/route.ts` - School settings management
- `/app/api/schools/[schoolId]/stats/route.ts` - School statistics

### User Management
- `/app/api/schools/[schoolId]/users/route.ts` - General user management
- `/app/api/schools/[schoolId]/teachers/route.ts` - Teacher-specific management
  - GET: Fetch all teachers with their classes and profile info
  - POST: Create new teacher with profile details
  - DELETE: Remove teacher and reassign their classes
- `/app/api/schools/[schoolId]/students/route.ts` - Student-specific management
  - GET: Fetch all students with their enrolled classes
  - POST: Create new student and optionally enroll in classes
  - DELETE: Remove student from school and classes

### Class Management
- `/app/api/schools/[schoolId]/classes/route.ts` - Class management
  - GET: Fetch all classes with teachers and students
  - POST: Create new class with assigned teacher
  - DELETE: Remove class and update relationships
- `/app/api/admin/classes/[classId]/teachers/route.ts` - Class teachers management
- `/app/api/admin/classes/[classId]/students/route.ts` - Class students management

### Assignment Management
- `/app/api/admin/classes/[classId]/assignments/route.ts` - Assignment management
- `/app/api/admin/assignments/[assignmentId]/submissions/route.ts` - Assignment submissions

### Practice Management
- `/app/api/schools/[schoolId]/practice/route.ts` - Practice quiz management
- `/app/api/schools/[schoolId]/practice/[quizId]/submissions/route.ts` - Practice submissions

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

## Important Files Guide

## Core Components

### Dashboard Components
- `/components/dashboard/SchoolAdmin-Tabs/SchoolAdminDashboard.tsx` - Main school admin dashboard component
- `/components/dashboard/SchoolAdmin-Tabs/OverviewTab.tsx` - Overview tab showing statistics
- `/components/dashboard/SchoolAdmin-Tabs/TeachersTab.tsx` - Teachers management tab
- `/components/dashboard/SchoolAdmin-Tabs/StudentsTab.tsx` - Students management tab
- `/components/dashboard/SchoolAdmin-Tabs/ClassesTab.tsx` - Classes management tab

### Authentication Components
- `/components/auth/SignInForm.tsx` - Sign in form component
- `/components/auth/SignUpForm.tsx` - Sign up form component

### UI Components
- `/components/ui/` - Contains all shared UI components (buttons, inputs, etc.)

## Pages

### Authentication Pages
- `/app/auth/signin/page.tsx` - Sign in page
- `/app/auth/signup/page.tsx` - Sign up page

### Dashboard Pages
- `/app/dashboard/page.tsx` - Main dashboard page
- `/app/dashboard/superadmin/page.tsx` - Super admin dashboard
- `/app/dashboard/schooladmin/page.tsx` - School admin dashboard
- `/app/dashboard/teacher/page.tsx` - Teacher dashboard
- `/app/dashboard/student/page.tsx` - Student dashboard

## API Routes

### Authentication
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth.js configuration and routes

### School Management
- `/app/api/admin/schools/route.ts` - Super admin school management
  - GET: List all schools
  - POST: Create new school
  - PUT: Update school details
- `/app/api/schools/[schoolId]/settings/route.ts` - School settings
  - GET: Get school settings
  - PUT: Update school settings
- `/app/api/schools/[schoolId]/stats/route.ts` - School statistics
  - GET: Get school statistics

### User Management
- `/app/api/schools/[schoolId]/teachers/route.ts` - Teacher management
  - GET: List all teachers in school with their classes and profile info
  - POST: Add new teacher with profile details
  - DELETE: Remove teacher from school
- `/app/api/schools/[schoolId]/students/route.ts` - Student management
  - GET: List all students in school with their enrolled classes
  - POST: Add new student and optionally enroll in classes
  - DELETE: Remove student from school

### Class Management
- `/app/api/schools/[schoolId]/classes/route.ts` - Class management
  - GET: List all classes with teachers and enrolled students
  - POST: Create new class with assigned teacher
  - PUT: Update class details
  - DELETE: Delete class
- `/app/api/schools/[schoolId]/classes/[classId]/students/route.ts` - Class student management
  - GET: List students in class
  - POST: Add students to class
  - DELETE: Remove students from class

### Quiz Management
- `/app/api/schools/[schoolId]/quizzes/route.ts` - Quiz management
  - GET: List all quizzes
  - POST: Create new quiz
  - PUT: Update quiz
  - DELETE: Delete quiz
- `/app/api/schools/[schoolId]/quizzes/[quizId]/questions/route.ts` - Quiz questions
  - GET: Get quiz questions
  - POST: Add question to quiz
  - PUT: Update question
  - DELETE: Remove question

### Submission Management
- `/app/api/schools/[schoolId]/submissions/route.ts` - Quiz submissions
  - GET: List submissions
  - POST: Submit quiz answers
- `/app/api/schools/[schoolId]/submissions/[submissionId]/grade/route.ts` - Submission grading
  - GET: Get submission grade
  - POST: Grade submission

## Database

### Core Models and Relationships

1. User Model (`/prisma/schema.prisma`)
   ```prisma
   model User {
     id          String    @id @default(cuid())
     email       String    @unique
     password    String
     name        String
     role        String    // SUPERADMIN, SCHOOLADMIN, TEACHER, STUDENT
     schoolId    String?
     teacherId   String?
     school      School?   @relation(fields: [schoolId], references: [id])
     teacher     User?     @relation("TeacherToStudent", fields: [teacherId], references: [id])
     students    User[]    @relation("TeacherToStudent")
     teachingClasses Class[] @relation("TeacherClasses")
     enrolledClasses Class[] @relation("StudentClasses")
   }
   ```

2. School Model
   ```prisma
   model School {
     id           String    @id @default(cuid())
     name         String
     roleNumber   String    @unique
     description  String?
     users        User[]    // All users in the school
     classes      Class[]   // All classes in the school
   }
   ```

3. Class Model
   ```prisma
   model Class {
     id          String    @id @default(cuid())
     name        String
     schoolId    String
     teacherId   String
     school      School    @relation(fields: [schoolId], references: [id])
     teacher     User      @relation("TeacherClasses", fields: [teacherId], references: [id])
     students    User[]    @relation("StudentClasses")
   }
   ```

### Important Relationships

1. School-User Relationship:
   - Each user belongs to one school (except SUPERADMIN)
   - Schools have many users (SCHOOLADMIN, TEACHER, STUDENT)
   - SchoolId is required for all school-related operations

2. Teacher-Student Relationship:
   - Teachers can have multiple students
   - Students can have multiple teachers
   - Managed through the TeacherToStudent relation

3. Class Management:
   - Classes belong to one school
   - Classes have one main teacher
   - Students can be enrolled in multiple classes
   - Teachers can teach multiple classes

### API Routes

1. User Management (`/app/api/admin/users/`)
   - GET: Fetch users with role/school filters
   - POST: Create new users
   - DELETE: Remove users
   - Parameters:
     - role: Filter by user role
     - schoolId: Filter by school

2. Class Management (`/app/api/admin/classes/`)
   - GET: Fetch classes for a school
   - POST: Create new classes
   - DELETE: Remove classes
   - Parameters:
     - schoolId: Required for all operations

### Common Operations

1. Adding a Teacher:
   ```typescript
   // POST /api/admin/users
   {
     name: string;
     email: string;
     role: "TEACHER";
     schoolId: string;
   }
   ```

2. Adding a Student:
   ```typescript
   // POST /api/admin/users
   {
     name: string;
     email: string;
     role: "STUDENT";
     schoolId: string;
     teacherId?: string; // Optional: Assign to a teacher
   }
   ```

3. Creating a Class:
   ```typescript
   // POST /api/admin/classes
   {
     name: string;
     schoolId: string;
     teacherId: string;
   }
   ```

### Important Notes

1. Role Hierarchy:
   - SUPERADMIN: Can manage all schools and users
   - SCHOOLADMIN: Can only manage their school's users and classes
   - TEACHER: Can manage their classes and students
   - STUDENT: Can view their classes and assignments

2. Data Access Rules:
   - Always check user's role and schoolId in API routes
   - SchoolAdmin can only access their school's data
   - Teachers can only access their classes and students
   - Students can only access their enrolled classes

3. Common Issues:
   - If users don't appear: Check schoolId matches
   - If classes don't appear: Verify teacher assignment
   - If students don't appear in class: Check enrollment status

4. Database Constraints:
   - Users must have valid roles
   - SchoolId required for all users except SUPERADMIN
   - Classes must have both school and teacher assigned

## Important Implementation Notes

### Prisma Client Usage
- `/lib/prisma.ts` exports a singleton Prisma client instance as a named export `{ prisma }`
- Always import Prisma client using: `import { prisma } from '@/lib/prisma'`
- Never create new PrismaClient instances outside of `lib/prisma.ts`
- The client is configured with query logging in development mode

### Database Models
{{ ... }}

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
