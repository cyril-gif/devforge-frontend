"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Learn', icon: '📖' },
  { href: '/games', label: 'Games', icon: '🎮' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '🏅' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show on landing page
  if (pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neon-dark/90 backdrop-blur-lg border-t border-neon-purple/30 py-2 px-4 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div className={`flex flex-col items-center gap-1 py-1 rounded-lg transition ${
              isActive ? 'text-neon-cyan' : 'text-gray-400 hover:text-gray-200'
            }`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}
      {/* Admin link – only visible if user role is admin */}
      {user?.role === 'admin' && (
        <Link href="/admin" className="flex-1">
          <div className={`flex flex-col items-center gap-1 py-1 rounded-lg transition ${
            pathname === '/admin' ? 'text-neon-cyan' : 'text-gray-400 hover:text-gray-200'
          }`}>
            <span className="text-xl">🛡️</span>
            <span className="text-xs font-medium">Admin</span>
          </div>
        </Link>
      )}
    </nav>
  );
}


