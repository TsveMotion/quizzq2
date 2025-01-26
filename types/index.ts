import { User, School, Class, Role } from "@prisma/client";

export interface ExtendedUser {
  id: string;
  name: string | null;
  email: string;
  email_verified: Date | null;
  image: string | null;
  role: Role;
  status: string;
  schoolId: string | null;
  teacherId: string | null;
  powerLevel: number;
  isPro: boolean;
  proSubscriptionId: string | null;
  proExpiresAt: Date | null;
  proType: string | null;
  proStatus: string | null;
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
  subscriptionPlan: string;
  aiDailyUsage: number;
  aiMonthlyUsage: number;
  aiLifetimeUsage: number;
  aiLastResetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassWithTeacher extends Class {
  teacher: {
    id: string;
    name: string | null;
    email: string;
    role: Role;
  } | null;
  students: {
    id: string;
    name: string | null;
    email: string;
    role: Role;
  }[];
  _count: {
    assignments: number;
    quizzes: number;
    students: number;
  };
}

export interface ExtendedSchoolWithRelations extends School {
  users: ExtendedUser[];
  classes: ClassWithTeacher[];
  _count: {
    users: number;
    classes: number;
  };
}
