"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('xp');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/leaderboard?sort=${sortBy}`);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neon-darker">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <Link href="/" className="text-neon-cyan hover:underline">
            ← Back
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSortBy('xp')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              sortBy === 'xp'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                : 'bg-neon-dark text-gray-400 hover:text-white'
            }`}
          >
            Top XP
          </button>
          <button
            onClick={() => setSortBy('streak')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              sortBy === 'streak'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                : 'bg-neon-dark text-gray-400 hover:text-white'
            }`}
          >
            Top Streak
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neon-cyan">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No users yet. Be the first!</div>
        ) : (
          <div className="bg-neon-dark/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-neon-purple/20 border-b border-neon-purple/30">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-right">XP</th>
                  <th className="py-3 px-4 text-right">🔥 Streak</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id} className="border-b border-neon-purple/10 hover:bg-neon-purple/5 transition">
                    <td className="py-3 px-4 font-bold text-neon-cyan">#{idx + 1}</td>
                    <td className="py-3 px-4">{u.username}{u._id === user?.id && ' (you)'}</td>
                    <td className="py-3 px-4 text-right text-neon-cyan">{u.xp}</td>
                    <td className="py-3 px-4 text-right">{u.streak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}