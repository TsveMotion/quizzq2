import { Class, School } from '@prisma/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  image: string | null;
  schoolId: string | null;
  teacherId: string | null;
  avatar: string | null;
  bio: string | null;
  password: string;
  emailVerified: Date | null;
  isPro: boolean;
  proSubscriptionId: string | null;
  proExpiresAt: Date | null;
  proType: string | null;
  powerLevel: number;
  proStatus: string;
  proPlan: string | null;
  proPlanId: string | null;
  proPlanName: string | null;
  proPlanPrice: number | null;
  proPlanCurrency: string | null;
  proPlanInterval: string | null;
  proPlanTrialPeriodDays: number | null;
  proPlanIsActive: boolean;
  proPlanIsTrial: boolean;
  proPlanStartedAt: Date | null;
  proPlanEndedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

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
