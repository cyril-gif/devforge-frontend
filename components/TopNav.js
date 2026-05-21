"use client";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function TopNav() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="hidden md:flex bg-neon-dark/80 border-b border-neon-purple/30 p-4 sticky top-0 z-50 justify-between items-center">
      <h1 className="text-xl font-bold text-neon-cyan">DevForge</h1>
      <div className="flex gap-6">
        <Link href="/games" className="hover:text-neon-purple">🎮 Games</Link>
        <Link href="/leaderboard" className="hover:text-neon-purple">🏆 Leaderboard</Link>
        <Link href="/profile" className="hover:text-neon-purple">👤 Profile</Link>
        <button onClick={logout} className="text-red-400">Logout</button>
      </div>
    </nav>
  );
}