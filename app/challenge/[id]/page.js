"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function ChallengePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [answers, setAnswers] = useState(Array(5).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) fetchChallenge();
  }, [id, user]);

  const fetchChallenge = async () => {
    try {
      const res = await api.get(`/api/challenges/${id}`);
      setChallenge(res.data);
      // If user already answered, populate existing answers
      const userId = user.id;
      const existingAnswers = userId === res.data.challengerId._id
        ? res.data.challengerAnswers
        : res.data.opponentAnswers;
      if (existingAnswers && existingAnswers.length) {
        setAnswers(existingAnswers);
        setSubmitted(true);
        // Determine result if challenge completed
        if (res.data.status === 'completed') {
          const won = res.data.winnerId?._id === userId;
          setResult({ won, xp: res.data.xpAwarded });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qIndex, optIndex) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const submitAnswers = async () => {
    if (answers.includes(-1)) {
      alert('Please answer all 5 questions before submitting.');
      return;
    }
    try {
      const res = await api.post(`/api/challenges/${id}/submit`, { answers });
      const updated = res.data;
      setSubmitted(true);
      const userId = user.id;
      const won = updated.winnerId?._id === userId;
      setResult({ won, xp: updated.xpAwarded });
      if (updated.status === 'completed') {
        // After both have answered, show result and auto‑redirect after 3s
        setTimeout(() => router.push('/games'), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting answers. Try again.');
    }
  };

  if (loading) return <div className="text-center py-20 text-neon-cyan">Loading challenge...</div>;
  if (!challenge) return <div className="text-center py-20 text-red-400">Challenge not found</div>;

  const isMyTurn = () => {
    const userId = user.id;
    const myAnswers = userId === challenge.challengerId._id
      ? challenge.challengerAnswers
      : challenge.opponentAnswers;
    return (!myAnswers || myAnswers.length === 0) && challenge.status === 'accepted';
  };

  const opponentName = challenge.challengerId._id === user.id
    ? challenge.opponentId.username
    : challenge.challengerId.username;

  return (
    <div className="min-h-screen bg-neon-darker p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neon-cyan">⚔️ Duel: {opponentName}</h1>
          <Link href="/games" className="text-neon-purple hover:underline">← Games</Link>
        </div>

        {!submitted ? (
          <>
            <p className="text-gray-300 mb-4">Answer all 5 questions correctly. The player with more correct answers wins +50 XP!</p>
            {challenge.questions.map((q, idx) => (
              <div key={idx} className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-4 mb-4">
                <p className="font-semibold mb-3">{idx+1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neon-purple/20 cursor-pointer">
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={optIdx}
                        checked={answers[idx] === optIdx}
                        onChange={() => handleAnswerChange(idx, optIdx)}
                        className="text-neon-purple"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={submitAnswers}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink py-3 rounded-lg font-bold text-lg mt-4"
            >
              Submit Answers
            </button>
          </>
        ) : (
          <div className="bg-neon-dark/50 border border-neon-purple/30 rounded-xl p-6 text-center">
            {result && (
              <>
                {result.won ? (
                  <div className="text-green-400 text-2xl mb-2">🎉 You won! 🎉</div>
                ) : (
                  <div className="text-red-400 text-2xl mb-2">😞 You lost</div>
                )}
                <p className="text-gray-300">You earned <span className="text-neon-cyan font-bold">{result.xp} XP</span> from this duel.</p>
                {challenge.status === 'completed' && (
                  <p className="text-gray-400 mt-4">Redirecting to Games hub...</p>
                )}
                {challenge.status !== 'completed' && (
                  <p className="text-gray-400 mt-4">Waiting for opponent to answer...</p>
                )}
              </>
            )}
          </div>
        )}

        {!isMyTurn() && !submitted && (
          <div className="text-center text-yellow-400 mt-4">
            ⏳ You've already answered. Waiting for opponent to finish...
          </div>
        )}
      </div>
    </div>
  );
}