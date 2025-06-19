import React, { useState, useEffect } from 'react';
import { Users, FileText, Settings, Activity, Shield, Database, Eye, UserPlus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import FileList from '../../components/FileList';
import { blockchainService, FileMetadata } from '../../services/blockchain';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'hod';
  walletAddress: string;
  status: 'active' | 'pending' | 'suspended';
  joinDate: Date;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [allFiles, setAllFiles] = useState<FileMetadata[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock users data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@college.edu',
        role: 'teacher',
        walletAddress: '0x1234567890123456789012345678901234567890',
        status: 'active',
        joinDate: new Date(2024, 0, 15)
      },
      {
        id: '2',
        name: 'Prof. Sunita Sharma',
        email: 'sunita.sharma@college.edu',
        role: 'hod',
        walletAddress: '0x2345678901234567890123456789012345678901',
        status: 'active',
        joinDate: new Date(2024, 1, 10)
      },
      {
        id: '3',
        name: 'Amit Kumar',
        email: 'amit.kumar@student.college.edu',
        role: 'student',
        walletAddress: '0x3456789012345678901234567890123456789012',
        status: 'pending',
        joinDate: new Date(2024, 2, 5)
      },
      {
        id: '4',
        name: 'Priya Singh',
        email: 'priya.singh@student.college.edu',
        role: 'student',
        walletAddress: '0x4567890123456789012345678901234567890123',
        status: 'active',
        joinDate: new Date(2024, 2, 8)
      }
    ];
    setUsers(mockUsers);

    // Mock audit logs
    const mockAuditLogs: AuditLog[] = [
      {
        id: '1',
        action: 'File Upload',
        user: 'Dr. Rajesh Kumar',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        details: 'Uploaded EC310 marks for semester 6'
      },
      {
        id: '2',
        action: 'File Approval',
        user: 'Prof. Sunita Sharma',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        details: 'Approved marksheet submission'
      },
      {
        id: '3',
        action: 'User Registration',
        user: 'System',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        details: 'New student registration: Amit Kumar'
      },
      {
        id: '4',
        action: 'Document Download',
        user: 'Priya Singh',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        details: 'Downloaded semester 5 marksheet'
      }
    ];
    setAuditLogs(mockAuditLogs);
  }, []);

  // Load all files
  useEffect(() => {
    loadAllFiles();
  }, []);

  const loadAllFiles = async () => {
    setLoading(true);
    try {
      const files = await blockchainService.getAllFiles();
      setAllFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status: 'active' } : user
      )
    );
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status: 'suspended' } : user
      )
    );
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'suspended':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'hod':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'teacher':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
      case 'student':
        return 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalFiles = allFiles.length;
  const approvedFiles = allFiles.filter(f => f.isApproved).length;

  return (
    <DashboardLayout
      title="Admin Dashboard"
      role="Admin"
      gradientFrom="from-red-500"
      gradientTo="to-pink-500"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <UserPlus className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingUsers}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Shield },
                { id: 'users', label: 'Manage Users', icon: Users },
                { id: 'documents', label: 'All Documents', icon: FileText },
                { id: 'audit', label: 'Audit Trail', icon: Activity },
                { id: 'settings', label: 'System Settings', icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600 dark:text-red-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.id === 'users' && pendingUsers > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {pendingUsers}
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
                    System Overview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Monitor and manage the entire EduChain platform from this central dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Active Users:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{activeUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">{pendingUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Teachers:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {users.filter(u => u.role === 'teacher').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Students:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {users.filter(u => u.role === 'student').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-cyan-200 dark:border-cyan-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Document Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{totalFiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{approvedFiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">
                          {totalFiles - approvedFiles}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Storage Used:</span>
                        <span className="font-medium text-gray-900 dark:text-white">2.4 GB</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">System Health</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Blockchain:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">IPFS:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Database:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Healthy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                        <span className="font-medium text-gray-900 dark:text-white">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      → Approve Users ({pendingUsers})
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      → Review Documents
                    </button>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      → View Audit Trail
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="text-left text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      → System Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Management
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Wallet Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                            {formatAddress(user.walletAddress)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.joinDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {user.status === 'pending' && (
                                <button
                                  onClick={() => handleApproveUser(user.id)}
                                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300"
                                >
                                  Approve
                                </button>
                              )}
                              {user.status === 'active' && (
                                <button
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                >
                                  Suspend
                                </button>
                              )}
                              <button className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All System Documents
                </h3>

                <FileList
                  files={allFiles}
                  title="Complete Document Archive"
                  loading={loading}
                />
              </div>
            )}

            {/* Audit Trail Tab */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Audit Trail
                </h3>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h4>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <Activity className="h-5 w-5 text-cyan-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {log.action}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {log.details}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900 dark:text-white">{log.user}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(log.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Blockchain Configuration
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contract Address
                        </label>
                        <input
                          type="text"
                          value="0x0000000000000000000000000000000000000000"
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Network
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option>Mumbai Testnet</option>
                          <option>Polygon Mainnet</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      IPFS Configuration
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Web3.Storage Token
                        </label>
                        <input
                          type="password"
                          placeholder="Enter your Web3.Storage API token"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gateway URL
                        </label>
                        <input
                          type="text"
                          value="https://w3s.link"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      File Upload Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max File Size (MB)
                        </label>
                        <input
                          type="number"
                          value="10"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Allowed File Types
                        </label>
                        <input
                          type="text"
                          value=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Security Settings
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Require Wallet Verification
                        </span>
                        <input
                          type="checkbox"
                          checked
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Auto-approve Teacher Files
                        </span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Enable Audit Logging
                        </span>
                        <input
                          type="checkbox"
                          checked
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;