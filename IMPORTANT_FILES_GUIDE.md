# QUIZZQ Project Structure Guide

This document outlines the key files and directories in the QUIZZQ project. Use this as a reference for understanding where important functionality is located.

## Core Configuration Files

- `/lib/auth-config.ts` - NextAuth configuration and authentication setup
- `/lib/prisma.ts` - Prisma client configuration for database access
- `/lib/routes.ts` - Route definitions and role-based routing configuration
- `/middleware.ts` - Authentication and route protection middleware

## API Routes Structure

### Authentication
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth.js API routes
- `/app/api/auth/register/route.ts` - User registration endpoint

### Admin Routes
- `/app/api/admin/schools/route.ts` - School management
  - GET: List all schools
  - POST: Create new school
  - PUT: Update school details
- `/app/api/admin/classes/route.ts` - Global class management
  - GET: List all classes
  - POST: Create new class
- `/app/api/admin/classes/[classId]/route.ts` - Individual class management
  - GET: Get class details
  - PUT: Update class
  - DELETE: Delete class
- `/app/api/admin/classes/[classId]/students/route.ts` - Class students management
  - GET: List students in class
  - POST: Add student to class
  - DELETE: Remove student from class
- `/app/api/admin/classes/[classId]/teachers/route.ts` - Class teachers management
  - GET: Get class teacher
  - POST: Assign teacher to class
  - DELETE: Remove teacher from class

### Teacher Routes
- `/app/api/teachers/classes/route.ts` - Teacher's classes
  - GET: List all classes for logged-in teacher
- `/app/api/teachers/classes/[classId]/students/route.ts` - Teacher's class students
  - GET: List students in teacher's class
- `/app/api/teachers/classes/[classId]/assignments/route.ts` - Class assignments
  - GET: List class assignments
  - POST: Create new assignment
  - PUT: Update assignment
  - DELETE: Delete assignment
- `/app/api/teachers/assignments/route.ts` - Teacher assignments
  - GET: List all assignments for teacher
  - POST: Create new assignment
- `/app/api/teachers/assignments/[assignmentId]/route.ts` - Individual assignment management
  - GET: Get assignment details with submissions
  - PUT: Update assignment
  - DELETE: Delete assignment
- `/app/api/teachers/assignments/generate/route.ts` - AI assignment generation
  - POST: Generate assignment content

### Student Routes
- `/app/api/students/classes/route.ts` - Student's classes
  - GET: List all classes for logged-in student
- `/app/api/students/classes/[classId]/assignments/route.ts` - Class assignments
  - GET: List class assignments
- `/app/api/students/assignments/route.ts` - Student assignments
  - GET: List all assignments for student
- `/app/api/students/assignments/[assignmentId]/route.ts` - Student assignment details
  - GET: Get assignment details
  - POST: Submit assignment
  - PUT: Update submission

### School Routes
- `/app/api/schools/[schoolId]/settings/route.ts` - School settings
  - GET: Get school settings
  - PUT: Update school settings
- `/app/api/schools/[schoolId]/teachers/route.ts` - School teachers
  - GET: List school teachers
  - POST: Add new teacher
  - DELETE: Remove teacher
- `/app/api/schools/[schoolId]/students/route.ts` - School students
  - GET: List school students
  - POST: Add new student
  - DELETE: Remove student
- `/app/api/schools/[schoolId]/classes/route.ts` - School classes
  - GET: List school classes
  - POST: Create new class
  - DELETE: Delete class

## Important Import Paths

### Core Imports
```typescript
// Authentication
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// Database
import { prisma } from '@/lib/prisma';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

// Icons
import { Search, Users, BookOpen, Calendar } from 'lucide-react';

// Utilities
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
```

### API Response Format
```typescript
// Success Response
return NextResponse.json(data);

// Error Response
return new NextResponse("Error message", { status: errorCode });
```

## Common API Patterns

### Authentication Check
```typescript
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Your code here...
  } catch (error) {
    console.error("[ERROR_TAG]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
```

### Role-Based Access
```typescript
if (session?.user?.role !== 'EXPECTED_ROLE') {
  return new NextResponse("Unauthorized", { status: 401 });
}
```

### Database Queries
```typescript
// Fetch with relations
const data = await prisma.model.findMany({
  where: { /* conditions */ },
  include: {
    relation: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});

// Create with relations
const newItem = await prisma.model.create({
  data: {
    field: value,
    relation: {
      connect: { id: relationId },
    },
  },
  include: {
    relation: true,
  },
});
```

## Error Handling
All API routes should follow this error handling pattern:
```typescript
try {
  // Your code here...
} catch (error) {
  console.error("[ROUTE_ERROR_TAG]", error);
  return new NextResponse("Internal error", { status: 500 });
}
```
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
