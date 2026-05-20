import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-darker">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neon-purple mb-4">404</h1>
        <h2 className="text-2xl text-gray-300 mb-4">Page Not Found</h2>
        <Link href="/" className="neon-button-primary inline-block">
          Return Home
        </Link>
      </div>
    </div>
  );
}