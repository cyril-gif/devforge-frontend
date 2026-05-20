"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ bio: '', location: '', website: '' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ xp: 0, streak: 0, longestStreak: 0, level: 1 });
  const [progress, setProgress] = useState({});
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile');
      setProfile(res.data.user);
      setStats(res.data.stats);
      setProgress(res.data.courseProgress);
      setCertificates(res.data.certificates);
      setFormData({
        bio: res.data.user.bio || '',
        location: res.data.user.location || '',
        website: res.data.user.website || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/api/profile', formData);
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-neon-cyan">Loading profile...</div>;
  if (!profile) return <div className="text-center py-20 text-red-400">Profile not found</div>;

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1024 * 1024) {
    alert('Image must be less than 1MB');
    return;
  }
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result;
    try {
      const res = await api.put('/api/profile', { avatar: base64 });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to upload avatar');
    }
  };
  reader.readAsDataURL(file);
};

  return (
    <div className="min-h-screen bg-neon-darker p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Profile
          </h1>
          <Link href="/" className="text-neon-cyan hover:underline">← Home</Link>
        </div>

        {/* Profile header */}
       <div className="flex items-center gap-4">
  <div className="relative">
    <div className="w-20 h-20 rounded-full bg-neon-purple/20 flex items-center justify-center text-3xl overflow-hidden">
      {profile.avatar ? (
        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        '👤'
      )}
    </div>
    <button
      onClick={() => document.getElementById('avatarInput').click()}
      className="absolute bottom-0 right-0 bg-neon-cyan text-black rounded-full p-1 text-xs"
    >
      📷
    </button>
    <input
      id="avatarInput"
      type="file"
      accept="image/jpeg,image/png,image/gif"
      className="hidden"
      onChange={handleAvatarChange}
    />
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

          {!editing && (
            <div className="mt-4">
              <p className="text-gray-300">{profile.bio || 'No bio yet.'}</p>
              {profile.website && <p className="text-neon-cyan"><a href={profile.website} target="_blank">{profile.website}</a></p>}
              <button onClick={() => setEditing(true)} className="mt-3 px-4 py-1 bg-neon-purple/20 text-neon-purple rounded-lg text-sm">
                Edit Profile
              </button>
            </div>
          )}
          {editing && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-black/50 border border-neon-purple/30 rounded-lg p-2"
                rows="3"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-black/50 border border-neon-purple/30 rounded-lg p-2"
              />
              <input
                type="url"
                placeholder="Website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full bg-black/50 border border-neon-purple/30 rounded-lg p-2"
              />
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-1 bg-neon-cyan text-black rounded-lg">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="px-4 py-1 bg-gray-600 rounded-lg">Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Course progress */}
        <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Course Progress</h3>
          <div className="space-y-3">
            {Object.values(progress).map(c => (
              <div key={c.title}>
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