"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function CoursePage() {
  const params = useParams();
  const id = params.id;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchCourse();
      fetchProgress();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
        const res = await api.get(`/api/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/progress/me');
      setProgress(res.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan text-xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">Course not found</div>
      </div>
    );
  }

  const completedLessons = progress?.completedLessons || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#0a0a0f] border-b border-[#bf4bf6]/30 p-6">
        <div className="container mx-auto">
          <Link href="/" className="text-[#00f0ff] hover:underline mb-4 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#bf4bf6] to-[#00f0ff] bg-clip-text text-transparent">
            {course.title}
          </h1>
          <p className="text-gray-400">{course.description}</p>
          <div className="mt-2 text-sm text-[#bf4bf6]">
            Total XP: {course.xpReward || 500} XP
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Lessons</h2>
        
        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-4">
            {course.lessons.map((lesson, idx) => {
              const isCompleted = completedLessons.includes(lesson._id);
              return (
                <div 
                  key={lesson._id} 
                  className={`bg-[#0a0a0f]/50 backdrop-blur-sm border rounded-xl p-5 flex justify-between items-center transition-all ${
                    isCompleted ? 'border-[#00f0ff]/50' : 'border-[#bf4bf6]/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isCompleted 
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff]' 
                        : 'bg-[#bf4bf6]/20 text-[#bf4bf6]'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{lesson.title}</h3>
                      <p className="text-sm text-gray-400">🎯 {lesson.xpValue} XP</p>
                    </div>
                  </div>
                  <Link href={`/lessons/${lesson._id}`}>
                    <button className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                      isCompleted
                        ? 'border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10'
                        : 'bg-gradient-to-r from-[#bf4bf6] to-[#ff6b6b] text-white hover:shadow-lg hover:shadow-[#bf4bf6]/50'
                    }`}>
                      {isCompleted ? 'Review →' : 'Start →'}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No lessons available yet for this course.
          </div>
        )}

        {/* Progress Summary */}
        {course.lessons && course.lessons.length > 0 && (
          <div className="mt-8 p-4 bg-[#bf4bf6]/10 rounded-lg border border-[#bf4bf6]/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Course Progress</span>
              <span className="text-[#00f0ff] font-bold">
                {completedLessons.filter(id => course.lessons.some(l => l._id === id)).length} / {course.lessons.length}
              </span>
            </div>
            <div className="w-full bg-[#0a0a0f] rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#bf4bf6] to-[#00f0ff] h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(completedLessons.filter(id => course.lessons.some(l => l._id === id)).length / course.lessons.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}