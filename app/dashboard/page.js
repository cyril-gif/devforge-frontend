"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchProgress();
    }
  }, [user]);

  const fetchCourses = async () => {
    const res = await api.get('/api/courses');
    setCourses(res.data);
  };

  const fetchProgress = async () => {
    const res = await api.get('/api/progress/me');
    setProgress(res.data);
  };

  const enrollCourse = async (courseId) => {
    await api.post(`/api/courses/${courseId}/enroll`);
    fetchProgress();
  };

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-neon-dark/80 backdrop-blur-sm border-b border-neon-purple/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            DevForge
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">{user.username}</p>
              <p className="text-neon-cyan font-bold">⚡ {progress?.xp || 0} XP</p>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex gap-2 mb-4">
            <span className="px-3 py-1 bg-neon-purple/20 rounded-full text-neon-purple text-sm">🔥 {progress?.streak || 0} Day Streak</span>
            <span className="px-3 py-1 bg-neon-cyan/20 rounded-full text-neon-cyan text-sm">🏆 {progress?.badges?.length || 0} Badges</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">Forge Your Future</h2>
          <p className="text-xl text-gray-300">Master full-stack development, one lesson at a time</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-8">Available Courses</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-neon-dark/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">{course.icon || '📚'}</div>
              <h4 className="text-xl font-bold mb-2">{course.title}</h4>
              <p className="text-gray-400 text-sm mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-neon-cyan text-sm">{course.lessons?.length || 0} lessons</span>
                {progress?.enrolledCourses?.includes(course._id) ? (
                  <Link href={`/courses/${course._id}`}>
                    <button className="px-4 py-1 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm">
                      Continue →
                    </button>
                  </Link>
                ) : (
                  <button onClick={() => enrollCourse(course._id)} className="px-4 py-1 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm">
                    Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(username, email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neon-purple/10 to-neon-pink/10">
      <div className="bg-neon-dark/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          DevForge
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-neon-dark border border-neon-purple/30 rounded-lg focus:outline-none focus:border-neon-cyan text-white"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-neon-dark border border-neon-purple/30 rounded-lg focus:outline-none focus:border-neon-cyan text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-neon-dark border border-neon-purple/30 rounded-lg focus:outline-none focus:border-neon-cyan text-white"
            required
          />
          <button type="submit" className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-neon-cyan hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}