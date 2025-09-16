'use client';

import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginFormProps {
  role: 'admin' | 'teacher' | 'user';
  onLogin: (credentials: { username: string; password: string }) => void;
}

const dummyCredentials = {
  admin: { username: 'admin', password: 'admin123' },
  teacher: { username: 'teacher', password: 'teacher123' },
  user: { username: 'user', password: 'user123' }
};

export default function LoginForm({ role, onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const correctCredentials = dummyCredentials[role];
    if (username === correctCredentials.username && password === correctCredentials.password) {
      onLogin({ username, password });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const roleColors = {
    admin: 'bg-red-600 hover:bg-red-700',
    teacher: 'bg-blue-600 hover:bg-blue-700',
    user: 'bg-green-600 hover:bg-green-600'
  };

  const roleTitles = {
    admin: 'Administrator',
    teacher: 'Teacher',
    user: 'Student'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
            <LogIn className="h-6 w-6 text-gray-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {roleTitles[role]} Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your {role} dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${roleColors[role]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Sign in
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600 font-medium">Demo Credentials:</p>
            <p className="text-sm text-gray-500">
              Username: <span className="font-mono">{dummyCredentials[role].username}</span>
            </p>
            <p className="text-sm text-gray-500">
              Password: <span className="font-mono">{dummyCredentials[role].password}</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
