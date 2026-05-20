"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ xp: 0, streak: 0, longestStreak: 0, level: 1 });
  const [progress, setProgress] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ bio: '', location: '', website: '' });
  const [avatarFile, setAvatarFile] = useState(null);

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

  // Helper to render streak calendar (simple weekly view)
  const renderStreakCalendar = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    // Mock: assume today is active if streak > 0, but we can just show a placeholder
    // For a real implementation, you'd need daily login data.
    const activeDays = [true, true, false, true, true, false, false]; // example
    return (
      <div className="flex justify-between gap-1 mt-2">
        {days.map((day, idx) => (
          <div key={day} className="text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
              activeDays[idx] ? 'bg-neon-cyan text-black' : 'bg-neon-dark text-gray-500'
            }`}>
              {day}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center py-20 text-neon-cyan">Loading profile...</div>;
  if (!profile) return <div className="text-center py-20 text-red-400">Profile not found</div>;

  return (
    <div className="min-h-screen bg-neon-darker pb-20">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {/* Profile Card */}
        <div className="bg-neon-dark/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-6 mb-6">
          {/* Avatar + Camera */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <div className="w-24 h-24 rounded-full bg-neon-purple/20 flex items-center justify-center text-4xl overflow-hidden">
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

            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <div className="flex items-center gap-2 text-gray-400 mt-1">
              <span>{profile.location || '🌍 Anywhere'}</span>
              <span>•</span>
              <span>🏆 Level {stats.level}</span>
            </div>

            {/* Followers / Following (placeholders) */}
            <div className="flex gap-6 mt-3 text-sm">
              <div><span className="font-bold text-neon-cyan">0</span> Followers</div>
              <div><span className="font-bold text-neon-cyan">0</span> Following</div>
            </div>

            {/* XP and Streak */}
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

            {/* Streak calendar */}
            <div className="w-full mt-4">
              <p className="text-sm text-gray-400 mb-1">This week</p>
              {renderStreakCalendar()}
            </div>

            {/* PRO Banner (optional) */}
            <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-2 flex justify-between items-center w-full">
              <span className="text-sm font-semibold">🚀 Try PRO for free</span>
              <button className="px-3 py-1 bg-yellow-500 text-black rounded-lg text-xs font-bold">START</button>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setEditing(!editing)}
              className="mt-4 px-4 py-1 bg-neon-purple/20 text-neon-purple rounded-lg text-sm"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-left">
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
              <button type="submit" className="w-full py-2 bg-neon-cyan text-black rounded-lg font-semibold">Save</button>
            </form>
          )}

          {/* Bio and website (if any) */}
          {profile.bio && !editing && (
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

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🎓 Certificates</h3>
            <ul className="list-disc list-inside text-neon-cyan">
              {certificates.map(cert => <li key={cert}>{cert} – Completed!</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}