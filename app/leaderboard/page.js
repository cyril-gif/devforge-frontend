"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetchLeaderboard();
    calculateWeeklyReset();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/api/leaderboard?sort=xp');
      setUsers(res.data);
      // find current user's rank
      if (user) {
        const rank = res.data.findIndex(u => u._id === user.id) + 1;
        setUserRank(rank > 0 ? rank : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyReset = () => {
    // Reset every Monday 00:00 UTC
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setUTCDate(now.getUTCDate() + ((1 + 7 - now.getUTCDay()) % 7));
    nextMonday.setUTCHours(0, 0, 0, 0);
    const diff = nextMonday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (3600000)) / (1000 * 60));
    setTimeLeft(`${days}d ${hours}h ${minutes}m`);
  };

  if (loading) return <div className="text-center py-20 text-neon-cyan">Loading leaderboard...</div>;

  return (
    <div className="min-h-screen bg-neon-darker p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <Link href="/" className="text-neon-cyan hover:underline">← Home</Link>
        </div>

        {/* Saturn League Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-neon-purple/30 rounded-xl p-5 mb-6 text-center">
          <div className="text-2xl font-bold text-neon-cyan">🏆 Saturn League</div>
          <div className="text-sm text-gray-300 mt-1">Ends in <span className="font-mono text-neon-purple">{timeLeft}</span></div>
          <div className="text-xs text-gray-400 mt-2">Top 50 climbers earn extra XP every Monday</div>
        </div>

        {/* User's own rank card */}
        {userRank && (
          <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Your Rank</p>
              <p className="text-2xl font-bold text-neon-cyan">#{userRank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">XP</p>
              <p className="text-xl font-bold text-neon-cyan">{users.find(u => u._id === user.id)?.xp || 0}</p>
            </div>
          </div>
        )}

        {/* Leaderboard list */}
        <div className="bg-neon-dark/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl overflow-hidden">
          {users.map((u, idx) => {
            let rankDisplay = '';
            if (idx === 0) rankDisplay = '🥇';
            else if (idx === 1) rankDisplay = '🥈';
            else if (idx === 2) rankDisplay = '🥉';
            else rankDisplay = `${idx+1}`;
            const isCurrentUser = u._id === user?.id;
            return (
              <div
                key={u._id}
                className={`flex justify-between items-center p-4 border-b border-neon-purple/10 ${
                  isCurrentUser ? 'bg-neon-purple/20' : 'hover:bg-neon-purple/5'
                } transition`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 font-bold text-neon-cyan">{rankDisplay}</span>
                  <span className={isCurrentUser ? 'text-neon-cyan font-semibold' : 'text-gray-200'}>
                    {u.username} {isCurrentUser && '(you)'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neon-cyan font-bold">{u.xp} XP</span>
                </div>
              </div>
            );
          })}
          {users.length === 0 && <div className="p-6 text-center text-gray-400">No users yet. Be the first!</div>}
        </div>
      </div>
    </div>
  );
}