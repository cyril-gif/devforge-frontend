import  ClientProviders  from '../components/ClientProviders';
import "./globals.css";

export const metadata = {
  title: 'DevForge - Learn Full-Stack Web Development',
  description: 'Master HTML, CSS, JavaScript, Node.js through interactive lessons and projects.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
