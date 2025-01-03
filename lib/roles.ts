export type UserRole = 'member' | 'student' | 'teacher' | 'schooladmin' | 'superadmin';

export const ROLES = {
  MEMBER: 'member',
  STUDENT: 'student',
  TEACHER: 'teacher',
  SCHOOLADMIN: 'schooladmin',
  SUPERADMIN: 'superadmin',
} as const;

export const POWER_LEVELS = {
  [ROLES.MEMBER]: 1,
  [ROLES.STUDENT]: 2,
  [ROLES.TEACHER]: 3,
  [ROLES.SCHOOLADMIN]: 4,
  [ROLES.SUPERADMIN]: 5,
} as const;

export function getRolePowerLevel(role: UserRole): number {
  return POWER_LEVELS[role] || 1;
}

export function isAuthorized(userRole: UserRole, requiredRole: UserRole): boolean {
  return getRolePowerLevel(userRole) >= getRolePowerLevel(requiredRole);
}

export function validateRole(role: string): role is UserRole {
  return Object.values(ROLES).includes(role as UserRole);
}

export function getNextRole(currentRole: UserRole): UserRole | null {
  const roles = Object.values(ROLES);
  const currentIndex = roles.indexOf(currentRole);
  return currentIndex < roles.length - 1 ? roles[currentIndex + 1] as UserRole : null;
}

export function getPreviousRole(currentRole: UserRole): UserRole | null {
  const roles = Object.values(ROLES);
  const currentIndex = roles.indexOf(currentRole);
  return currentIndex > 0 ? roles[currentIndex - 1] as UserRole : null;
}
