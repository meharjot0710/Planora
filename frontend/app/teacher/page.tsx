'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import Timetable from '../components/Timetable';
import { LogOut, GraduationCap, Calendar } from 'lucide-react';

export default function TeacherPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (credentials: { username: string; password: string }) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginForm role="teacher" onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Timetable role="teacher" />
      </main>
      <input type="textbox" placeholder="Submit your request to admin" className="w-full p-2 border border-gray-300 rounded-md mt-4 mb-24 text-black" />
      <button className="bg-blue-500 text-white p-2 rounded-md">Submit</button>
    </div>
  );
}
