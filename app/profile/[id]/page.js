"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function UserProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ xp: 0, streak: 0, longestStreak: 0, level: 1 });
  const [progress, setProgress] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/profile/${id}`);
      setProfile(res.data.user);
      setStats(res.data.stats);
      setProgress(res.data.courseProgress);
      setCertificates(res.data.certificates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-neon-cyan">Loading profile...</div>;
  if (!profile) return <div className="text-center py-20 text-red-400">User not found</div>;

  const isOwnProfile = user?.id === id;

  return (
    <div className="min-h-screen bg-neon-darker pb-20">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {/* Profile Card (read‑only) */}
        <div className="bg-neon-dark/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-neon-purple/20 flex items-center justify-center text-4xl overflow-hidden mb-4">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>

            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <div className="flex items-center gap-2 text-gray-400 mt-1">
              <span>{profile.location || '🌍 Anywhere'}</span>
              <span>•</span>
              <span>🏆 Level {stats.level}</span>
            </div>

            {/* XP and Streak stats */}
            <div className="grid grid-cols-2 gap-4 w-full mt-4 bg-black/30 rounded-lg p-3">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total XP</p>
                <p className="text-2xl font-bold text-neon-cyan">{stats.xp}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-neon-purple">🔥 {stats.streak}</p>
              </div>
            </div>

            {/* Bio & website */}
            {profile.bio && (
              <div className="mt-4 text-center text-gray-300 border-t border-neon-purple/20 pt-4">
                <p>{profile.bio}</p>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-neon-cyan text-sm block mt-1">
                    {profile.website}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">📚 Course Progress</h3>
          {Object.values(progress).length === 0 && <p className="text-gray-400">No courses started yet.</p>}
          {Object.values(progress).map(c => (
            <div key={c.title} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{c.title}</span>
                <span>{Math.round(c.percent)}%</span>
              </div>
              <div className="w-full bg-black rounded-full h-2">
                <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full" style={{ width: `${c.percent}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Certificates (if any) */}
        {certificates.length > 0 && (
          <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🎓 Certificates</h3>
            <ul className="list-disc list-inside text-neon-cyan">
              {certificates.map(cert => <li key={cert}>{cert} – Completed!</li>)}
            </ul>
          </div>
        )}

        {/* Back to Leaderboard link */}
        <div className="text-center mt-4">
          <Link href="/leaderboard" className="text-neon-cyan text-sm hover:underline">
            ← Back to Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}