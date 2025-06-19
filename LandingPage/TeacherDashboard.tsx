import React, { useState, useEffect } from 'react';
import { BookOpen, Edit, Send, CheckCircle, Clock, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';
import { blockchainService, FileMetadata } from '../../services/blockchain';
import { useWallet } from '../../context/WalletContext';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  marks?: number;
}

interface Course {
  id: string;
  code: string;
  name: string;
  students: Student[];
}

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [marksData, setMarksData] = useState<{ [key: string]: number }>({});
  const [submittedFiles, setSubmittedFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const { account } = useWallet();

  // Mock courses data
  const courses: Course[] = [
    {
      id: '1',
      code: 'EC310',
      name: 'Digital Signal Processing',
      students: [
        { id: '1', name: 'Amit Kumar', rollNumber: '20EC001' },
        { id: '2', name: 'Priya Sharma', rollNumber: '20EC002' },
        { id: '3', name: 'Rahul Singh', rollNumber: '20EC003' },
        { id: '4', name: 'Sneha Patel', rollNumber: '20EC004' },
        { id: '5', name: 'Vikash Gupta', rollNumber: '20EC005' }
      ]
    },
    {
      id: '2',
      code: 'EC320',
      name: 'Microprocessors and Microcontrollers',
      students: [
        { id: '6', name: 'Anita Roy', rollNumber: '20EC006' },
        { id: '7', name: 'Suresh Kumar', rollNumber: '20EC007' },
        { id: '8', name: 'Kavya Reddy', rollNumber: '20EC008' }
      ]
    }
  ];

  // Load teacher's submitted files
  useEffect(() => {
    if (account) {
      loadSubmittedFiles();
    }
  }, [account]);

  const loadSubmittedFiles = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const files = await blockchainService.getFilesByUploader(account);
      setSubmittedFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId: string, marks: number) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: marks
    }));
  };

  const handleSubmitMarks = async () => {
    if (!selectedCourse || Object.keys(marksData).length === 0) {
      alert('Please select a course and enter marks for at least one student');
      return;
    }

    try {
      // Create marks data as JSON
      const course = courses.find(c => c.id === selectedCourse);
      const marksSheet = {
        courseCode: course?.code,
        courseName: course?.name,
        submittedBy: account,
        submissionDate: new Date().toISOString(),
        marks: Object.entries(marksData).map(([studentId, marks]) => {
          const student = course?.students.find(s => s.id === studentId);
          return {
            studentId,
            studentName: student?.name,
            rollNumber: student?.rollNumber,
            marks
          };
        })
      };

      // Convert to blob and create file
      const blob = new Blob([JSON.stringify(marksSheet, null, 2)], { type: 'application/json' });
      const file = new File([blob], `${course?.code}_marks_${Date.now()}.json`, { type: 'application/json' });

      // Upload using FileUpload component logic
      const ipfsService = await import('../../services/ipfs');
      const ipfsHash = await ipfsService.ipfsService.uploadFile(file);
      
      const fileId = await blockchainService.storeFile(
        file.name,
        ipfsHash,
        'teacher',
        'marksheet'
      );

      alert(`Marks submitted successfully! File ID: ${fileId}`);
      
      // Reset form
      setMarksData({});
      setSelectedCourse('');
      
      // Reload files
      loadSubmittedFiles();

    } catch (error) {
      console.error('Error submitting marks:', error);
      alert('Failed to submit marks. Please try again.');
    }
  };

  const handleFileUpload = (fileId: string, ipfsHash: string) => {
    loadSubmittedFiles();
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const pendingSubmissions = submittedFiles.filter(f => !f.isApproved).length;
  const approvedSubmissions = submittedFiles.filter(f => f.isApproved).length;

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      role="Teacher"
      gradientFrom="from-emerald-500"
      gradientTo="to-teal-500"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courses.reduce((total, course) => total + course.students.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedSubmissions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                { id: 'marks', label: 'Enter Marks', icon: Edit },
                { id: 'submissions', label: 'My Submissions', icon: Send },
                { id: 'upload', label: 'Upload Files', icon: Send }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.label}</span>
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
                    Welcome to Teacher Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Manage your courses, enter student marks, and submit them securely to the blockchain for HOD approval.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('marks')}
                        className="block w-full text-left text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                      >
                        → Enter Student Marks
                      </button>
                      <button
                        onClick={() => setActiveTab('submissions')}
                        className="block w-full text-left text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                      >
                        → View Submission Status
                      </button>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="block w-full text-left text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                      >
                        → Upload Course Materials
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-cyan-200 dark:border-cyan-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">My Courses</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {courses.map((course) => (
                        <p key={course.id}>• {course.code} - {course.name}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My Courses
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {course.code} - {course.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {course.students.length} students enrolled
                      </p>
                      <div className="space-y-1">
                        {course.students.slice(0, 3).map((student) => (
                          <p key={student.id} className="text-xs text-gray-500 dark:text-gray-400">
                            {student.rollNumber} - {student.name}
                          </p>
                        ))}
                        {course.students.length > 3 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            +{course.students.length - 3} more students
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Marks Entry Tab */}
            {activeTab === 'marks' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enter Student Marks
                </h3>

                <div className="mb-6">
                  <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Course
                  </label>
                  <select
                    id="courseSelect"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCourseData && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Students in {selectedCourseData.code}
                    </h4>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {selectedCourseData.students.map((student) => (
                          <div key={student.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{student.rollNumber}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <label htmlFor={`marks-${student.id}`} className="text-sm text-gray-600 dark:text-gray-400">
                                Marks:
                              </label>
                              <input
                                type="number"
                                id={`marks-${student.id}`}
                                min="0"
                                max="100"
                                value={marksData[student.id] || ''}
                                onChange={(e) => handleMarksChange(student.id, parseInt(e.target.value) || 0)}
                                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitMarks}
                      disabled={Object.keys(marksData).length === 0}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Submit Marks to Blockchain
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Submission Status
                </h3>

                <FileList
                  files={submittedFiles}
                  title="My Submissions"
                  loading={loading}
                />
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Course Materials
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FileUpload
                    title="Course Materials"
                    description="Upload lecture notes, assignments, etc."
                    role="teacher"
                    fileType="course-material"
                    acceptedTypes=".pdf,.doc,.docx,.ppt,.pptx"
                    onUploadComplete={handleFileUpload}
                  />

                  <FileUpload
                    title="Assessment Files"
                    description="Upload question papers, answer keys, etc."
                    role="teacher"
                    fileType="assessment"
                    acceptedTypes=".pdf,.doc,.docx"
                    onUploadComplete={handleFileUpload}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;