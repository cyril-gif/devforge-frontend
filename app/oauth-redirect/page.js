"use client";
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function OAuthRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUserFromSocial } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Decode token to get user info (or call backend /me endpoint)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(user => {
          setUserFromSocial(token, user);
          router.push('/dashboard');
        })
        .catch(() => router.push('/'));
    } else {
      router.push('/');
    }
  }, [searchParams, router, setUserFromSocial]);

  return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>
}