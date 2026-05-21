"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neon-dark/80 border-t border-neon-purple/30 mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              DevForge
            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Forge your future in web development.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-neon-cyan mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/dashboard" className="hover:text-neon-purple">Courses</Link></li>
              <li><Link href="/games" className="hover:text-neon-purple">Games</Link></li>
              <li><Link href="/leaderboard" className="hover:text-neon-purple">Leaderboard</Link></li>
              <li><Link href="/profile" className="hover:text-neon-purple">Profile</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-neon-cyan mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-neon-purple">Documentation</a></li>
              <li><a href="#" className="hover:text-neon-purple">Community</a></li>
              <li><a href="#" className="hover:text-neon-purple">Support</a></li>
              <li><a href="#" className="hover:text-neon-purple">Blog</a></li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h4 className="font-semibold text-neon-cyan mb-3">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-neon-cyan text-xl">🐦</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan text-xl">📘</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan text-xl">💻</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan text-xl">📧</a>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              © {new Date().getFullYear()} DevForge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}