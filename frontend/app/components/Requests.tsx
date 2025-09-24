"use client";

import React, { useState } from "react";

interface Request {
  id: string;
  teacher: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Requests = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      teacher: "Dr. Sarah Johnson",
      date: "2024-01-15",
      reason: "I am not available on this day",
      status: 'pending'
    },
    {
      id: "2", 
      teacher: "Prof. Michael Chen",
      date: "2024-01-16",
      reason: "Medical appointment scheduled",
      status: 'pending'
    },
    {
      id: "3",
      teacher: "Dr. Emily Rodriguez",
      date: "2024-01-17", 
      reason: "Conference attendance required",
      status: 'pending'
    }
  ]);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✓';
      case 'rejected': return '✗';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Requests</h1>
          <p className="text-gray-600">Review and manage teacher availability requests</p>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {requests.map((request) => (
            <div 
              key={request.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                        <span className="mr-1">{getStatusIcon(request.status)}</span>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.teacher}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span> {new Date(request.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Status Message for Processed Requests */}
                  {request.status !== 'pending' && (
                    <div className="lg:ml-6">
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        request.status === 'approved' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {request.status === 'approved' ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Request Approved
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Request Rejected
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests</h3>
            <p className="mt-1 text-sm text-gray-500">There are no pending requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;