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
    <div className="min-h-screen bg-neon-darker p-4 pb-20">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Profile
          </h1>
          <Link href="/leaderboard" className="text-neon-cyan hover:underline">← Back</Link>
        </div>

        {/* User info card */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-neon-purple/20 flex items-center justify-center text-3xl overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <p className="text-gray-400">{profile.location || '🌍 Anywhere'}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-neon-cyan">⭐ {stats.xp} XP</span>
                <span className="text-neon-purple">🔥 {stats.streak} day streak</span>
                <span className="text-yellow-400">🏆 Level {stats.level}</span>
              </div>
            </div>
          </div>
          {profile.bio && <p className="mt-4 text-gray-300">{profile.bio}</p>}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-neon-cyan block mt-2">
              🔗 {profile.website}
            </a>
          )}
        </div>

        {/* Course Progress */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Course Progress</h3>
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

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Certificates 🎓</h3>
            <ul className="list-disc list-inside text-neon-cyan">
              {certificates.map(cert => <li key={cert}>{cert} – Completed!</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}