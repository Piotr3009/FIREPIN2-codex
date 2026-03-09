import { Pin, Role } from '@prisma/client';

export function canViewPin(userId: string, role: Role, pin: Pick<Pin, 'assignedOperativeId'>): boolean {
  if (role === 'ADMIN') return true;
  return pin.assignedOperativeId === userId;
}
