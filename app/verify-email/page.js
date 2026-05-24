"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    api.get(`/api/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        setTimeout(() => router.push('/'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. Token may be expired.');
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-darker">
      <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-8 max-w-md text-center">
        {status === 'verifying' && <p className="text-neon-cyan">Verifying your email...</p>}
        {status === 'success' && <p className="text-green-400">{message}</p>}
        {status === 'error' && <p className="text-red-400">{message}</p>}
        <Link href="/" className="mt-4 inline-block text-neon-cyan underline">Go to Home</Link>
      </div>
    </div>
  );
}