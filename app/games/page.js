"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function GamesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [history, setHistory] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  
  // New states for random opponent & search
  const [randomOpponent, setRandomOpponent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchPending();
      fetchHistory();
      fetchWeeklyLeaderboard();
    }
  }, [user]);

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(() => {
      setSearching(true);
      api.get(`/api/users/search?q=${searchTerm}`)
        .then(res => setSearchResults(res.data))
        .catch(err => console.error(err))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchCourses = async () => {
    const res = await api.get('/api/courses');
    setCourses(res.data);
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

  const createChallenge = async (opponentId) => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }
    await api.post('/api/challenges', { opponentId, courseId: selectedCourse });
    alert('Challenge sent!');
    fetchPending();
  };

  const acceptChallenge = async (challengeId) => {
    await api.post(`/api/challenges/${challengeId}/accept`);
    window.location.href = `/challenge/${challengeId}`;
  };

  const getRandomOpponent = async () => {
    setRandomOpponent(null);
    try {
      const res = await api.get('/api/users/random');
      setRandomOpponent(res.data);
    } catch (err) {
      console.error(err);
      alert('Could not fetch random opponent');
    }
  };

  return (
    <div className="min-h-screen bg-neon-darker p-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            🎮 Game Arena
          </h1>
          <Link href="/dashboard" className="text-neon-cyan hover:underline">← Dashboard</Link>
        </div>

        {/* Course selector (used by all challenge forms) */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Choose a Course to Duel</h2>
          <select
            className="w-full bg-black/50 border border-neon-purple/30 rounded-lg p-2"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        {/* Random Opponent */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🎲 Random Opponent</h2>
          {randomOpponent ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                  {randomOpponent.avatar ? <img src={randomOpponent.avatar} className="rounded-full w-full h-full object-cover"/> : '👤'}
                </div>
                <span className="font-semibold">{randomOpponent.username}</span>
              </div>
              <button
                onClick={() => createChallenge(randomOpponent._id)}
                className="px-4 py-2 bg-neon-cyan text-black rounded-lg font-semibold"
              >
                Challenge
              </button>
            </div>
          ) : (
            <button
              onClick={getRandomOpponent}
              className="w-full py-2 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-semibold"
            >
              Find Random Opponent
            </button>
          )}
        </div>

        {/* Search Players */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔍 Search for Players</h2>
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-neon-purple/30 rounded-lg p-2 mb-3"
          />
          {searching && <p className="text-gray-400">Searching...</p>}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(user => (
                <div key={user._id} className="flex justify-between items-center border-b border-neon-purple/20 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center">
                      {user.avatar ? <img src={user.avatar} className="rounded-full w-full h-full object-cover"/> : '👤'}
                    </div>
                    {user.username}
                  </div>
                  <button
                    onClick={() => createChallenge(user._id)}
                    className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-lg text-sm"
                  >
                    Challenge
                  </button>
                </div>
              ))}
            </div>
          )}
          {searchTerm.length >= 2 && searchResults.length === 0 && !searching && (
            <p className="text-gray-400 text-center">No users found</p>
          )}
        </div>

        {/* Pending Challenges */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">⚔️ Pending Challenges</h2>
          {pendingChallenges.length === 0 && <p className="text-gray-400">None</p>}
          {pendingChallenges.map(c => (
            <div key={c._id} className="flex justify-between items-center border-b border-neon-purple/20 py-2">
              <span>{c.challengerId?.username} challenged you</span>
              <button onClick={() => acceptChallenge(c._id)} className="bg-green-600 px-3 py-1 rounded-lg text-sm">Accept</button>
            </div>
          ))}
        </div>

        {/* Weekly Leaderboard */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🏆 Weekly Challenge Champions</h2>
          {weeklyLeaderboard.length === 0 && <p className="text-gray-400">No challenges completed this week.</p>}
          {weeklyLeaderboard.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-neon-purple/20 py-1">
              <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`} {item.username}</span>
              <span className="text-neon-cyan">{item.xp} XP</span>
            </div>
          ))}
        </div>

        {/* Duel History */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📜 Your Duel History</h2>
          {history.length === 0 && <p className="text-gray-400">No duels yet.</p>}
          {history.map(c => (
            <div key={c._id} className="border-b border-neon-purple/20 py-2">
              <p>
                {c.winnerId?._id === user?.id ? '✅ Won' : '❌ Lost'} against {c.challengerId._id === user?.id ? c.opponentId?.username : c.challengerId?.username}
                <span className="text-sm text-gray-400 ml-2">({new Date(c.completedAt).toLocaleDateString()})</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}