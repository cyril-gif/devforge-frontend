import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

export const metadata = {
  title: 'DevForge - Learn Full-Stack Web Development',
  description: 'Master HTML, CSS, JavaScript, Node.js through interactive lessons and quizzes. Build real projects with Vibe Coding.',
  keywords: 'learn coding, web development, HTML, CSS, JavaScript, Node.js, programming',
  authors: [{ name: 'DevForge' }],
  openGraph: {
    title: 'DevForge - Become a Full-Stack Developer',
    description: 'Join thousands of learners mastering web development',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
