import React, { useState, useEffect } from 'react';
import { Download, Upload, FileText, Bell, User, Award, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';
import NotificationCard, { Notification } from '../../components/NotificationCard';
import { blockchainService, FileMetadata } from '../../services/blockchain';
import { useWallet } from '../../context/WalletContext';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [myFiles, setMyFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const { account } = useWallet();

  // Mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Marksheet Available',
        message: 'Your semester 6 marksheet is now available for download.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'Document Verification Complete',
        message: 'Your Aadhar card verification has been completed successfully.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false
      },
      {
        id: '3',
        type: 'warning',
        title: 'Pending Document',
        message: 'Please upload your income certificate for scholarship processing.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Load student files
  useEffect(() => {
    if (account) {
      loadMyFiles();
    }
  }, [account]);

  const loadMyFiles = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const files = await blockchainService.getFilesByUploader(account);
      setMyFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (fileId: string, ipfsHash: string) => {
    // Refresh file list after upload
    loadMyFiles();
    
    // Add success notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'success',
      title: 'File Uploaded Successfully',
      message: `Your file has been uploaded to IPFS and stored on blockchain with ID: ${fileId}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestType || !requestDescription) return;

    // Add request notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'info',
      title: 'Request Submitted',
      message: `Your ${requestType} request has been submitted and is pending review.`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Reset form
    setRequestType('');
    setRequestDescription('');
  };

  const requestTypes = [
    'Bonafide Certificate',
    'Name Correction',
    'Grade Correction',
    'Transcript Request',
    'Character Certificate',
    'Migration Certificate',
    'Duplicate Marksheet',
    'Other'
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout
      title="Student Dashboard"
      role="Student"
      gradientFrom="from-cyan-500"
      gradientTo="to-blue-500"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{myFiles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Docs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myFiles.filter(f => f.isApproved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myFiles.filter(f => !f.isApproved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notifications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'downloads', label: 'Downloads', icon: Download },
                { id: 'upload', label: 'Upload Documents', icon: Upload },
                { id: 'requests', label: 'Requests', icon: FileText }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.id === 'notifications' && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
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
                    Welcome to Your Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Manage your academic documents, download marksheets, and submit requests securely through our blockchain-powered platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-cyan-200 dark:border-cyan-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('downloads')}
                        className="block w-full text-left text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                      >
                        → Download Latest Marksheet
                      </button>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="block w-full text-left text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                      >
                        → Upload Documents
                      </button>
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="block w-full text-left text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                      >
                        → Submit New Request
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>• Document uploaded 2 hours ago</p>
                      <p>• Marksheet downloaded yesterday</p>
                      <p>• Bonafide request approved</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications ({unreadCount} unread)
                </h3>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDismiss={handleDismissNotification}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Downloads Tab */}
            {activeTab === 'downloads' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Available Downloads
                </h3>
                
                {/* Mock downloadable files */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Latest Marksheet</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Semester 6 - Final Results</p>
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors">
                      Download PDF
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-cyan-200 dark:border-cyan-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Complete Transcript</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">All Semesters Combined</p>
                    <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>

                <FileList
                  files={myFiles.filter(f => f.isApproved)}
                  title="Verified Documents"
                  loading={loading}
                />
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Documents
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FileUpload
                    title="Verification Upload"
                    description="Upload marksheet for authenticity verification"
                    role="student"
                    fileType="verification"
                    acceptedTypes=".pdf,.jpg,.jpeg,.png"
                    onUploadComplete={handleFileUpload}
                  />

                  <FileUpload
                    title="Certificate Upload"
                    description="Upload Aadhar, Income, Category certificates"
                    role="student"
                    fileType="certificate"
                    acceptedTypes=".pdf,.jpg,.jpeg,.png"
                    onUploadComplete={handleFileUpload}
                  />
                </div>

                <FileList
                  files={myFiles}
                  title="My Uploaded Documents"
                  loading={loading}
                />
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Submit Request
                </h3>

                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  <div>
                    <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Request Type
                    </label>
                    <select
                      id="requestType"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select request type</option>
                      {requestTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="requestDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      id="requestDescription"
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Please provide details about your request..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;