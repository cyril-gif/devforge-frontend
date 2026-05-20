"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login, register } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      setShowAuthModal(false);
      router.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  const courses = [
    { title: 'HTML', icon: '🌐', description: 'Structure the web', color: 'from-orange-500 to-red-500' },
    { title: 'CSS', icon: '🎨', description: 'Style beautifully', color: 'from-blue-500 to-cyan-500' },
    { title: 'JavaScript', icon: '⚡', description: 'Make it interactive', color: 'from-yellow-500 to-orange-500' },
    { title: 'Node.js', icon: '🚀', description: 'Backend APIs', color: 'from-green-500 to-emerald-500' },
    { title: 'Vibe Coding', icon: '🎵', description: 'Creative projects', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-darker to-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          DevForge
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => { setIsLogin(true); setShowAuthModal(true); }}
            className="px-5 py-2 rounded-lg border border-neon-purple text-neon-purple hover:bg-neon-purple/10"
          >
            Log in
          </button>
          <button
            onClick={() => { setIsLogin(false); setShowAuthModal(true); }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent">
          Forge Your Future
        </h1>
        <p className="text-xl text-gray-300 mt-6">
          Master full‑stack development through interactive lessons, quizzes, and real‑world projects.
        </p>
        <button
          onClick={() => { setIsLogin(false); setShowAuthModal(true); }}
          className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white text-lg font-semibold hover:shadow-lg transition"
        >
          Start Learning – It's Free
        </button>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why learn with DevForge?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'Bite‑sized Lessons', desc: 'Learn at your own pace with short, focused modules.' },
              { icon: '🎮', title: 'Gamified Challenges', desc: 'Earn XP, maintain streaks, and compete on leaderboards.' },
              { icon: '🏆', title: 'Code Duels', desc: 'Challenge friends to 5‑question battles and win extra XP.' },
              { icon: '📱', title: 'Mobile First', desc: 'Learn anywhere, anytime – fully responsive and installable as an app.' },
              { icon: '📜', title: 'Certificates', desc: 'Earn certificates for each completed course.' },
              { icon: '👥', title: 'Community', desc: 'Connect with other learners and share projects.' },
            ].map((feat, i) => (
              <div key={i} className="bg-neon-dark/30 backdrop-blur-sm rounded-xl p-6 text-center border border-neon-purple/20">
                <div className="text-4xl mb-3">{feat.icon}</div>
                <h3 className="text-xl font-semibold">{feat.title}</h3>
                <p className="text-gray-400 mt-2">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Choose your path</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {courses.map((course) => (
            <div key={course.title} className="bg-neon-dark/30 rounded-xl p-5 text-center border border-neon-purple/20 hover:scale-105 transition">
              <div className="text-4xl mb-2">{course.icon}</div>
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-400">{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-purple/20 py-8 text-center text-gray-500 text-sm">
        © 2026 DevForge. Built with ❤️ for learners everywhere.
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowAuthModal(false)}>
          <div className="bg-neon-dark border border-neon-purple/30 rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-neon-purple/30 rounded-lg"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-neon-purple/30 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-neon-purple/30 rounded-lg"
                required
              />
              <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold">
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            <p className="text-center text-gray-400 mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-neon-cyan hover:underline">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}