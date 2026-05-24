"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api'; // for resend endpoint
import Footer from '@/components/Footer';
import SocialLoginButtons from '@/components/SocialLoginButtons';

export default function LandingPage() {
  const { user, login, register } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // for resend verification
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [showResend, setShowResend] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
    // Check for verified=true query param (after email verification)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      alert('Email verified! You can now log in.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, router]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        setShowAuthModal(false);
        router.push('/dashboard');
      } else {
        // Registration: no auto-login, just show message
        await register(username, email, password);
        alert('Registration successful! Please check your email to verify your account.');
        setShowAuthModal(false);
        // Reset form
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (isLogin && status === 403 && message?.includes('verify your email')) {
        setUnverifiedEmail(email);
        setShowResend(true);
        alert(message);
      } else {
        alert(message || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    }
  };

  const resendVerification = async () => {
    try {
      await api.post('/api/auth/resend-verification', { email: unverifiedEmail });
      alert('Verification email resent! Check your inbox.');
      setShowResend(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend verification');
    }
  };

  const courses = [
    { title: 'HTML', icon: '🌐', description: 'Structure the web' },
    { title: 'CSS', icon: '🎨', description: 'Style beautifully' },
    { title: 'JavaScript', icon: '⚡', description: 'Make it interactive' },
    { title: 'Node.js', icon: '🚀', description: 'Backend APIs' },
    { title: 'Vibe Coding', icon: '🎵', description: 'Creative projects' },
    { title: 'Express.js', icon: '⚙️', description: 'Web framework' },
    { title: 'Python', icon: '🐍', description: 'Versatile language' },
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.title} className="bg-neon-dark/30 rounded-xl p-5 text-center border border-neon-purple/20 hover:scale-105 transition">
              <div className="text-4xl mb-2">{course.icon}</div>
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-400">{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowAuthModal(false)}>
          <div className="bg-neon-dark border border-neon-purple/30 rounded-xl p-6 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
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
              <SocialLoginButtons />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    router.push('/forgot-password');
                  }}
                  className="text-sm text-neon-cyan hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold">
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            {showResend && (
              <div className="mt-3 text-center">
                <p className="text-yellow-400 text-sm">Didn't receive the email?</p>
                <button onClick={resendVerification} className="text-neon-cyan text-sm underline">
                  Click here to resend verification email
                </button>
              </div>
            )}
            <p className="text-center text-gray-400 mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setShowResend(false); setUnverifiedEmail(''); }} className="text-neon-cyan hover:underline">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}