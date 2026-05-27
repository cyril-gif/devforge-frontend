"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
      fetchCourses();
      fetchStats();
    }
  }, [user]);

  const fetchUsers = async () => {
    const res = await api.get('/api/admin/users');
    setUsers(res.data);
  };
  const fetchCourses = async () => {
    const res = await api.get('/api/admin/courses');
    setCourses(res.data);
  };
  const fetchStats = async () => {
    const res = await api.get('/api/admin/stats');
    setStats(res.data);
  };

  const updateUserRole = async (userId, role) => {
    await api.put(`/api/admin/users/${userId}/role`, { role });
    fetchUsers();
  };
  const deleteUser = async (userId) => {
    if (confirm('Delete this user?')) {
      await api.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    }
  };
  const deleteCourse = async (courseId) => {
    if (confirm('Delete this course and all its lessons?')) {
      await api.delete(`/api/admin/courses/${courseId}`);
      fetchCourses();
    }
  };
  const deleteLesson = async (lessonId) => {
    if (confirm('Delete this lesson?')) {
      await api.delete(`/api/admin/lessons/${lessonId}`);
      fetchCourses();
    }
  };

  if (!user || user.role !== 'admin') return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neon-darker p-6 pb-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h1>
      <div className="flex gap-4 mb-6 border-b pb-2">
        {['users', 'courses', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === tab
                ? 'bg-neon-purple text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-neon-dark/50 rounded-xl shadow">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">XP</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t dark:border-gray-700">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u._id, e.target.value)}
                      className="bg-gray-100 dark:bg-gray-700 rounded p-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">{u.xp}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="space-y-8">
          {courses.map(course => (
            <div key={course._id} className="bg-white dark:bg-neon-dark/50 rounded-xl p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{course.title}</h2>
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete Course
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
              <div className="space-y-2">
                {course.lessons.map(lesson => (
                  <div key={lesson._id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <span>{lesson.title} (XP: {lesson.xpValue})</span>
                    <button
                      onClick={() => deleteLesson(lesson._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neon-dark/50 p-4 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-3xl font-bold text-neon-purple">{stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-neon-dark/50 p-4 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">Total Courses</p>
            <p className="text-3xl font-bold text-neon-purple">{stats.totalCourses}</p>
          </div>
          <div className="bg-white dark:bg-neon-dark/50 p-4 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">Total Lessons</p>
            <p className="text-3xl font-bold text-neon-purple">{stats.totalLessons}</p>
          </div>
          <div className="bg-white dark:bg-neon-dark/50 p-4 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">Lessons Completed</p>
            <p className="text-3xl font-bold text-neon-purple">{stats.totalCompletedLessons}</p>
          </div>
          <div className="bg-white dark:bg-neon-dark/50 p-4 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">Total XP Earned</p>
            <p className="text-3xl font-bold text-neon-purple">{stats.totalXP}</p>
          </div>
        </div>
      )}
    </div>
  );
}



