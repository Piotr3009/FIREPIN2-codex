import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <div className="pt-12">
      <p className="mb-3 text-sm text-slate-600">Fire stopping project controls for UK site teams.</p>
      <AuthForm />
    </div>
  );
}
