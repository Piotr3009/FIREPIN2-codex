'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';

const initialState = { error: '' };

export function AuthForm() {
  const [state, action, pending] = useActionState(loginAction as never, initialState);

  return (
    <form action={action} className="space-y-3 rounded-xl bg-white p-4 shadow">
      <h1 className="text-xl font-semibold">FirePin Login</h1>
      <input name="email" type="email" required placeholder="Email" className="w-full rounded border p-2" />
      <input name="password" type="password" required placeholder="Password" className="w-full rounded border p-2" />
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <button disabled={pending} className="w-full rounded bg-slate-900 p-2 text-white disabled:opacity-50">
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
