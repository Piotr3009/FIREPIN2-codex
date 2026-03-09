import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Session = {
  userId: string;
  role: 'ADMIN' | 'OPERATIVE';
  name: string;
  email: string;
};

const SESSION_COOKIE = 'firepin_session';

export async function setSession(session: Session) {
  const store = await cookies();
  store.set(SESSION_COOKIE, Buffer.from(JSON.stringify(session)).toString('base64url'), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as Session;
  } catch {
    return null;
  }
}

export async function requireRole(roles: Session['role'][]) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (!roles.includes(session.role)) redirect('/unauthorized');
  return session;
}
