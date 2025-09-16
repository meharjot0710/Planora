'use client';

import { useState } from 'react';
import { Users, GraduationCap, User, ArrowRight, Calendar, Upload, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Upload CSV files and manage timetable data',
      icon: Users,
      color: 'red',
      href: '/admin',
      features: ['CSV Upload', 'Timetable Management', 'Data Overview']
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'View your teaching schedule and classes',
      icon: GraduationCap,
      color: 'blue',
      href: '/teacher',
      features: ['Teaching Schedule', 'Class Overview', 'Time Management']
    },
    {
      id: 'user',
      title: 'Student',
      description: 'View your class timetable and schedule',
      icon: User,
      color: 'green',
      href: '/user',
      features: ['Class Schedule', 'Subject Details', 'Room Information']
    }
  ];

  const getColorClasses = (color: string, isHovered: boolean) => {
    const colorMap = {
      red: {
        bg: isHovered ? 'bg-red-600' : 'bg-red-500',
        text: 'text-red-600',
        border: 'border-red-200',
        hover: 'hover:bg-red-50'
      },
      blue: {
        bg: isHovered ? 'bg-blue-600' : 'bg-blue-500',
        text: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-50'
      },
      green: {
        bg: isHovered ? 'bg-green-600' : 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-200',
        hover: 'hover:bg-green-50'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Planora</h1>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-2">School Management System</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Planora
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive school management system with timetable management, 
            CSV upload capabilities, and role-based access for administrators, 
            teachers, and students.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            const colors = getColorClasses(role.color, hoveredRole === role.id);
            
            return (
              <Link
                key={role.id}
                href={role.href}
                className="group"
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                <div className={`bg-white rounded-lg shadow-lg p-8 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl border-2 ${colors.border} ${colors.hover}`}>
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.bg} mb-6 transition-colors duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {role.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <div className={`w-2 h-2 rounded-full ${colors.bg} mr-3`}></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className={`inline-flex items-center px-6 py-3 rounded-lg ${colors.bg} text-white font-medium group-hover:shadow-lg transition-all duration-300`}>
                      Access Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <Upload className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">CSV Upload</h4>
              <p className="text-sm text-gray-600">Easy timetable data import via CSV files</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Timetable View</h4>
              <p className="text-sm text-gray-600">Interactive weekly and daily schedule views</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Role-Based Access</h4>
              <p className="text-sm text-gray-600">Different interfaces for admin, teacher, and student</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Management</h4>
              <p className="text-sm text-gray-600">Intuitive interface for all user types</p>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Demo Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">{role.title}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Username:</span>
                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                      {role.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Password:</span>
                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                      {role.id}123
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Planora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}