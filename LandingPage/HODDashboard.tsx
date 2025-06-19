import React, { useState, useEffect } from 'react';
import { CheckCircle, X, FileText, Users, Clock, Award, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import FileList from '../../components/FileList';
import { blockchainService, FileMetadata } from '../../services/blockchain';
import { useWallet } from '../../context/WalletContext';

interface PendingRequest {
  id: string;
  type: string;
  studentName: string;
  studentId: string;
  description: string;
  submittedDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const HODDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingFiles, setPendingFiles] = useState<FileMetadata[]>([]);
  const [allFiles, setAllFiles] = useState<FileMetadata[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { account } = useWallet();

  // Mock pending requests
  useEffect(() => {
    const mockRequests: PendingRequest[] = [
      {
        id: '1',
        type: 'Bonafide Certificate',
        studentName: 'Amit Kumar',
        studentId: '20EC001',
        description: 'Required for scholarship application',
        submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: '2',
        type: 'Name Correction',
        studentName: 'Priya Sharma',
        studentId: '20EC002',
        description: 'Correction in first name spelling',
        submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: '3',
        type: 'Grade Correction',
        studentName: 'Rahul Singh',
        studentId: '20EC003',
        description: 'Correction in EC310 marks',
        submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    ];
    setPendingRequests(mockRequests);
  }, []);

  // Load files for review
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      // Get files by teacher role for review
      const teacherFiles = await blockchainService.getFilesByRole('teacher');
      setPendingFiles(teacherFiles.filter(f => !f.isApproved));
      
      // Get all files for department overview
      const allDeptFiles = await blockchainService.getAllFiles();
      setAllFiles(allDeptFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFile = async (fileIndex: number) => {
    try {
      await blockchainService.approveFile(fileIndex + 1); // Assuming file ID is index + 1
      alert('File approved successfully!');
      loadFiles(); // Reload files
    } catch (error) {
      console.error('Error approving file:', error);
      alert('Failed to approve file. Please try again.');
    }
  };

  const handleApproveRequest = (requestId: string) => {
    setPendingRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setPendingRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pendingCount = pendingFiles.length + pendingRequests.filter(r => r.status === 'pending').length;
  const approvedCount = allFiles.filter(f => f.isApproved).length + pendingRequests.filter(r => r.status === 'approved').length;

  return (
    <DashboardLayout
      title="HOD Dashboard"
      role="HOD"
      gradientFrom="from-purple-500"
      gradientTo="to-indigo-500"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{allFiles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Award },
                { id: 'review-marks', label: 'Review Marks', icon: CheckCircle },
                { id: 'requests', label: 'Student Requests', icon: FileText },
                { id: 'documents', label: 'All Documents', icon: Eye },
                { id: 'summary', label: 'Department Summary', icon: Users }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {(tab.id === 'review-marks' && pendingFiles.length > 0) && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {pendingFiles.length}
                      </span>
                    )}
                    {(tab.id === 'requests' && pendingRequests.filter(r => r.status === 'pending').length > 0) && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {pendingRequests.filter(r => r.status === 'pending').length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Welcome to HOD Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Review and approve teacher submissions, manage student requests, and oversee department activities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pending Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('review-marks')}
                        className="block w-full text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        → Review {pendingFiles.length} Mark Submissions
                      </button>
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="block w-full text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        → Process {pendingRequests.filter(r => r.status === 'pending').length} Student Requests
                      </button>
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="block w-full text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        → Review Department Documents
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>• 3 mark sheets approved today</p>
                      <p>• 2 bonafide requests processed</p>
                      <p>• 1 grade correction approved</p>
                      <p>• Department summary updated</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Marks Tab */}
            {activeTab === 'review-marks' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Review Teacher Submissions
                </h3>

                <FileList
                  files={pendingFiles}
                  title="Pending Mark Submissions"
                  showApprovalActions={true}
                  onApprove={handleApproveFile}
                  loading={loading}
                />
              </div>
            )}

            {/* Student Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Student Requests
                </h3>

                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`border rounded-lg p-6 ${
                        request.status === 'pending'
                          ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                          : request.status === 'approved'
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              {request.type}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                : request.status === 'approved'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Student</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {request.studentName} ({request.studentId})
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {formatDate(request.submittedDate)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                            <p className="text-gray-900 dark:text-white">{request.description}</p>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-md transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
                            >
                              <X className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Department Documents
                </h3>

                <FileList
                  files={allFiles}
                  title="All Department Files"
                  loading={loading}
                />
              </div>
            )}

            {/* Department Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Department Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Document Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{allFiles.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {allFiles.filter(f => f.isApproved).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">
                          {allFiles.filter(f => !f.isApproved).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Request Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Requests:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{pendingRequests.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {pendingRequests.filter(r => r.status === 'approved').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">
                          {pendingRequests.filter(r => r.status === 'pending').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">File Types</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Marksheets:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {allFiles.filter(f => f.fileType === 'marksheet').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Certificates:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {allFiles.filter(f => f.fileType === 'certificate').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Course Materials:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {allFiles.filter(f => f.fileType === 'course-material').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HODDashboard;