import  ClientProviders  from '../components/ClientProviders';
import "./globals.css";

export const metadata = {
  title: 'DevForge - Learn Full-Stack Web Development',
  description: 'Master HTML, CSS, JavaScript, Node.js through interactive lessons and projects.',
  manifest: '/manifest.json',
  themeColor: '8b5cf6',
  viewport: 'width=device-width, initial-scale=1 viewport-fit=cover',
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
