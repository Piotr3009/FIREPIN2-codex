import { describe, expect, it } from 'vitest';
import { canViewPin } from '@/lib/access-control';

describe('access control', () => {
  it('admin can view any pin', () => {
    expect(canViewPin('u1', 'ADMIN', { assignedOperativeId: 'u2' })).toBe(true);
  });

  it('operative only sees own pins', () => {
    expect(canViewPin('u1', 'OPERATIVE', { assignedOperativeId: 'u1' })).toBe(true);
    expect(canViewPin('u1', 'OPERATIVE', { assignedOperativeId: 'u2' })).toBe(false);
  });
});
