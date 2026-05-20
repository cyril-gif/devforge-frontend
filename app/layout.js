import { AuthProvider } from '@/contexts/AuthContext';
import BottomNav from '@/components/BottomNav';
import "./globals.css";

export const metadata = {
  title: 'DevForge - Learn Full-Stack Web Development',
  description: 'Master HTML, CSS, JavaScript, Node.js through interactive lessons and projects.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'DevForge' },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}