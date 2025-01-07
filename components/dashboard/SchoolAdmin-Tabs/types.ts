import { Class, User, School } from '@prisma/client';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface ClassTeacher {
  id: string;
  classId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  teacher: Teacher;
}

export interface ClassWithTeacher {
  id: string;
  name: string;
  description: string | null;
  schoolId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  teacher: Teacher;
  students: Student[];
  classTeachers: ClassTeacher[];
  _count: {
    assignments: number;
    quizzes: number;
    students: number;
  };
}

export interface SchoolWithRelations extends School {
  users: User[];
  classes: ClassWithTeacher[];
  _count: {
    users: number;
    classes: number;
  };
}
