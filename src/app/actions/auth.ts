'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { setSession, clearSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid email or password.' };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: 'Invalid email or password.' };

  await setSession({ userId: user.id, role: user.role, name: user.name, email: user.email });
  redirect(user.role === 'ADMIN' ? '/admin/projects' : '/operative/pins');
}

export async function logoutAction() {
  await clearSession();
  redirect('/login');
}
