"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && user) {
      fetchLesson();
    }
  }, [id, user]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      // Direct API call to get lesson by ID
      const res = await api.get(`/api/lessons/${id}`);
      setLesson(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError('Failed to load lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async () => {
    try {
      const res = await api.post('/api/progress/complete-lesson', {
        lessonId: id,
        quizAnswers
      });
      setResult(res.data);
      if (res.data.success) {
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      setResult({ success: false, message: 'Error submitting quiz. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan text-xl">Loading lesson...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl text-center">
          <p>{error || 'Lesson not found'}</p>
          <button onClick={() => router.back()} className="mt-4 neon-button-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-[#0a0a0f] border-b border-[#bf4bf6]/30 p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <Link href="/" className="text-[#00f0ff] hover:underline">
            ← Back to Courses
          </Link>
          <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
          <div className="text-sm text-[#bf4bf6] mt-1">🎯 {lesson.xpValue} XP upon completion</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#0a0a0f]/50 backdrop-blur-sm border border-[#bf4bf6]/30 rounded-xl p-6 mb-8">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>

        {!showQuiz ? (
          <button 
            onClick={() => setShowQuiz(true)} 
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#bf4bf6] to-[#ff6b6b] text-white font-semibold"
          >
            Take Quiz to Earn {lesson.xpValue} XP →
          </button>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#00f0ff]">Quiz</h3>
            <p className="text-gray-400">Answer the following questions to complete this lesson (70% to pass)</p>
            
            {lesson.quiz && lesson.quiz.map((q, idx) => (
              <div key={idx} className="bg-[#0a0a0f]/50 border border-[#bf4bf6]/30 rounded-xl p-6">
                <p className="font-semibold mb-4 text-lg">{idx + 1}. {q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#bf4bf6]/20 cursor-pointer">
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={optIdx}
                        onChange={() => {
                          const newAnswers = [...quizAnswers];
                          newAnswers[idx] = optIdx;
                          setQuizAnswers(newAnswers);
                        }}
                        className="w-4 h-4 text-[#bf4bf6]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <button 
              onClick={completeLesson} 
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#bf4bf6] text-white font-semibold"
            >
              Submit Quiz & Complete Lesson
            </button>
          </div>
        )}

        {result && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            result.success 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {result.success 
              ? `✅ Success! You earned +${result.xpGained} XP! Redirecting...` 
              : `❌ ${result.message || `Try again!`}`}
          </div>
        )}
      </div>
    </div>
  );
}