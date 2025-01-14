import { User, School, Class } from "@prisma/client";

export interface ExtendedUser extends User {
  status: string;
  subscriptionStatus: string;
  subscriptionPlan: string;
  subscriptionId: string | null;
  subscriptionEndDate: Date | null;
}

export interface ClassWithTeacher extends Class {
  teacher: ExtendedUser;
  students: ExtendedUser[];
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
