"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function GamesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [history, setHistory] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchUsers();
      fetchPending();
      fetchHistory();
      fetchWeeklyLeaderboard();
    }
  }, [user]);

  const fetchCourses = async () => {
    const res = await api.get('/api/courses');
    setCourses(res.data);
  };
  const fetchUsers = async () => {
    const res = await api.get('/api/users'); // need a simple /api/users endpoint
    setUsers(res.data.filter(u => u._id !== user?.id));
  };
  const fetchPending = async () => {
    const res = await api.get('/api/challenges/pending');
    setPendingChallenges(res.data);
  };
  const fetchHistory = async () => {
    const res = await api.get('/api/challenges/history');
    setHistory(res.data);
  };
  const fetchWeeklyLeaderboard = async () => {
    const res = await api.get('/api/challenges/weekly-leaderboard');
    setWeeklyLeaderboard(res.data);
  };

  const createChallenge = async () => {
    if (!selectedCourse || !selectedOpponent) return;
    await api.post('/api/challenges', {
      opponentId: selectedOpponent,
      courseId: selectedCourse,
    });
    alert('Challenge sent!');
    setSelectedCourse('');
    setSelectedOpponent('');
  };

  const acceptChallenge = async (challengeId) => {
    await api.post(`/api/challenges/${challengeId}/accept`);
    window.location.href = `/challenge/${challengeId}`;
  };

  return (
    <div className="min-h-screen bg-neon-darker p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-neon-cyan">🎮 Game Arena</h1>
          <Link href="/" className="text-neon-purple hover:underline">← Home</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Challenge */}
          <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Create a Challenge</h2>
            <select
              className="w-full bg-black/50 border border-neon-purple/30 rounded-lg p-2 mb-3"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <select
              className="w-full bg-black/50 border border-neon-purple/30 rounded-lg p-2 mb-3"
              value={selectedOpponent}
              onChange={(e) => setSelectedOpponent(e.target.value)}
            >
              <option value="">Select Opponent</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
            </select>
            <button
              onClick={createChallenge}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink py-2 rounded-lg font-semibold"
            >
              Send Challenge
            </button>
          </div>

          {/* Pending Challenges */}
          <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Pending Challenges</h2>
            {pendingChallenges.length === 0 && <p className="text-gray-400">None</p>}
            {pendingChallenges.map(c => (
              <div key={c._id} className="flex justify-between items-center border-b border-neon-purple/20 py-2">
                <span>{c.challengerId.username} challenged you</span>
                <button onClick={() => acceptChallenge(c._id)} className="bg-green-600 px-3 py-1 rounded-lg text-sm">Accept</button>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Leaderboard */}
        <div className="mt-6 bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">🏆 Weekly Challenge Champions</h2>
          <div className="space-y-2">
            {weeklyLeaderboard.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-neon-purple/20 py-1">
                <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`} {item.username}</span>
                <span className="text-neon-cyan">{item.xp} XP</span>
              </div>
            ))}
            {weeklyLeaderboard.length === 0 && <p className="text-gray-400">No challenges completed this week.</p>}
          </div>
        </div>

        {/* History */}
        <div className="mt-6 bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Your Duel History</h2>
          {history.map(c => (
            <div key={c._id} className="border-b border-neon-purple/20 py-2">
              <p>
                {c.winnerId?._id === user?.id ? '✅ Won' : '❌ Lost'} against {c.challengerId._id === user?.id ? c.opponentId.username : c.challengerId.username}
                <span className="text-sm text-gray-400 ml-2">({new Date(c.completedAt).toLocaleDateString()})</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}