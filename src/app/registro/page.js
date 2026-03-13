'use client';
import RegisterForm from '@/components/auth/RegisterForm';


export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}