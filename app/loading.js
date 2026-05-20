export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-darker">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🔥</div>
        <div className="text-neon-cyan text-xl">DevForge</div>
        <div className="text-gray-400 text-sm mt-2">Loading...</div>
      </div>
    </div>
  );
}