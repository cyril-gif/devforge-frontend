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
  const [accessDenied, setAccessDenied] = useState(false);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    if (id && user) {
      fetchLessonAndCheckAccess();
    }
  }, [id, user]);

  const fetchLessonAndCheckAccess = async () => {
    setLoading(true);
    try {
      // First fetch the lesson details
      const lessonRes = await api.get(`/api/lessons/${id}`);
      const lessonData = lessonRes.data;
      setLesson(lessonData);
      setCourseId(lessonData.courseId);

      // Fetch the full course to check lesson order and completion
      const courseRes = await api.get(`/api/courses/${lessonData.courseId}`);
      const course = courseRes.data;
      const lessons = course.lessons;

      // Find current lesson index
      const lessonIndex = lessons.findIndex(l => l._id === id);
      if (lessonIndex === -1) {
        setAccessDenied(true);
        return;
      }

      // If it's the first lesson, always allowed
      if (lessonIndex === 0) {
        setAccessDenied(false);
        return;
      }

      // Check if all previous lessons are completed
      const previousLessons = lessons.slice(0, lessonIndex);
      const allPreviousCompleted = previousLessons.every(l => l.completed === true);

      if (!allPreviousCompleted) {
        setAccessDenied(true);
        return;
      }

      setAccessDenied(false);
    } catch (err) {
      console.error(err);
      setAccessDenied(true);
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
          router.push(`/courses/${courseId}`);
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

  if (accessDenied || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-400 text-xl text-center">
          🔒 You must complete the previous lesson before accessing this one.
        </div>
        <Link
          href={courseId ? `/courses/${courseId}` : '/dashboard'}
          className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white font-semibold"
        >
          Go to Course Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neon-darker pb-20">
      <div className="bg-[#0a0a0f] border-b border-[#bf4bf6]/30 p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <Link
            href={courseId ? `/courses/${courseId}` : '/'}
            className="text-[#00f0ff] hover:underline inline-flex items-center gap-2"
          >
            ← Back to Course
          </Link>
          <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
          <div className="text-sm text-[#bf4bf6] mt-1">🎯 {lesson.xpValue} XP upon completion</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#0a0a0f]/50 backdrop-blur-sm border border-[#bf4bf6]/30 rounded-xl p-6 mb-8">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />

          {lesson.videoUrl && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-neon-cyan mb-3">🎥 Watch Tutorial</h3>
              <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={lesson.videoUrl}
                  title="Video tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        {!showQuiz ? (
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#bf4bf6] to-[#ff6b6b] text-white font-semibold hover:shadow-lg hover:shadow-[#bf4bf6]/50 transition-all"
          >
            Take Quiz to Earn {lesson.xpValue} XP →
          </button>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#00f0ff]">Quiz</h3>
            <p className="text-gray-400">Answer the following questions to complete this lesson (70% to pass)</p>

            {lesson.quiz && lesson.quiz.map((q, idx) => (
              <div key={idx} className="bg-[#0a0a0f]/50 backdrop-blur-sm border border-[#bf4bf6]/30 rounded-xl p-6">
                <p className="font-semibold mb-4 text-lg">{idx + 1}. {q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#bf4bf6]/20 cursor-pointer transition-all">
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
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#bf4bf6] text-white font-semibold hover:shadow-lg hover:shadow-[#00f0ff]/50 transition-all"
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
              : `❌ ${result.message || `Score: ${result.score}%. Try again!`}`}
          </div>
        )}
      </div>
    </div>
  );
}