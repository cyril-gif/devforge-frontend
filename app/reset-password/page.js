"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get('token');
    if (!t) {
      setError('No reset token provided.');
    } else {
      setToken(t);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/api/auth/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => router.push('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) return <div className="min-h-screen flex items-center justify-center text-neon-cyan">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-darker p-4">
      <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Set New Password
        </h1>
        {message && <p className="text-green-400 text-center mb-4">{message}</p>}
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-neon-purple/30 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-neon-purple/30 rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <p className="text-center text-gray-400 mt-4">
          <Link href="/" className="text-neon-cyan hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}