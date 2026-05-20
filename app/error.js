'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-darker">
      <div className="text-center p-8 bg-neon-dark/50 rounded-xl border border-red-500/30">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong!</h2>
        <p className="text-gray-300 mb-4">{error.message}</p>
        <button onClick={reset} className="neon-button-primary">
          Try again
        </button>
      </div>
    </div>
  );
}