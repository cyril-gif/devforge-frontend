"use client";

export default function SocialLoginButtons() {
  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth/google`;
  };

  const handleGitHub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth/github`;
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={handleGoogle}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-neon-purple/30 bg-white/10 hover:bg-white/20 transition"
      >
        <span>🔵</span> Sign in with Google
      </button>
      <button
        onClick={handleGitHub}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-neon-purple/30 bg-white/10 hover:bg-white/20 transition"
      >
        <span>🐙</span> Sign in with GitHub
      </button>
    </div>
  );
}