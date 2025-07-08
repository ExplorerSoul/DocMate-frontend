import { useState, useEffect } from 'react';
import {
  Upload, FileText, User, Shield, Menu, X, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileList from '../../components/FileList';
import UploadDocumentForm from '../../components/UploadDocumentForm';
import WalletInfo from '../../components/WalletInfo';
import useContract from '../../hooks/useContract';
import { useWallet } from '../../context/WalletContext';
import { blockchainService } from '../../services/blockchain';
import '../../css/AdminDashboard.css';

const AdminDashboard = () => {
  const { account, connectWallet } = useWallet();
  const contract = useContract();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedType, setSelectedType] = useState("all");
  const [files, setFiles] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Token + user verification
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login/admin");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.warn("⚠️ Token expired. Logging out.");
        handleLogout();
        return;
      }
    } catch (err) {
      console.error("⚠️ Invalid token. Logging out.");
      handleLogout();
      return;
    }

    setUser(storedUser);
  }, []);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (account) loadData();
  }, [account]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fileResponse, studentList] = await Promise.all([
        blockchainService.getAllFiles(),
        blockchainService.getAllStudents().catch(err => {
          console.error("❌ Student fetch failed:", err);
          return [];
        })
      ]);

      const docs = fileResponse?.documents || fileResponse || [];
      setFiles(Array.isArray(docs) ? docs : []);
      setStudents(studentList);
    } catch (err) {
      console.error("Error loading admin data:", err);
      if (err.response?.status === 403) {
        alert("⚠️ Session expired. Please login again.");
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStudent = async (id) => {
    try {
      await blockchainService.approveStudent(id);
      await loadData();
    } catch (err) {
      console.error("Error approving student:", err);
    }
  };

  const handleRevokeStudent = async (id) => {
    try {
      await blockchainService.revokeStudent(id);
      await loadData();
    } catch (err) {
      console.error("Error revoking student:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login/admin");
  };

  const filteredFiles = selectedType === "all"
    ? files
    : files.filter(file => file.category?.toLowerCase() === selectedType);

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'files', label: 'File List', icon: FileText }, // 🆕 New Tab
    { id: 'students', label: 'Students', icon: UserPlus }
  ];


  if (!user) return null; // Prevent rendering while user is loading

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        
        <div className="header-content">
          <div className="dashboard-title">
            <User className="title-icon" />
            <h1 className="title-text">{user?.institute || 'Institute'} Dashboard</h1>
          </div>

          <nav className="desktop-nav">
            {tabItems.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-button ${activeTab === tab.id ? 'nav-button-active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{tab.label}</span>
                </button>
              );
            })}
            <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
          </nav>

          <button onClick={() => setNavOpen(!navOpen)} className="mobile-menu-button">
            {navOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
          </button>
        </div>

        {navOpen && (
          <div className="mobile-nav">
            <nav className="mobile-nav-content">
              {tabItems.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setNavOpen(false);
                    }}
                    className={`mobile-nav-button ${activeTab === tab.id ? 'mobile-nav-button-active' : ''}`}
                  >
                    <Icon className="mobile-nav-icon" />
                    <span className="mobile-nav-label">{tab.label}</span>
                  </button>
                );
              })}
              <button onClick={handleLogout} className="mobile-nav-button logout-button">Logout</button>
            </nav>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Files</p>
              <p className="stat-value">{files.length}</p>
            </div>
            <div className="stat-icon stat-icon-blue"><FileText /></div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Students</p>
              <p className="stat-value">{students.length}</p>
            </div>
            <div className="stat-icon stat-icon-emerald"><User /></div>
          </div>
        </div>


        <div className="dashboard-card">
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-container">
                <div className="welcome-section">
                  <h3 className="section-title">Welcome {user.name || "Admin"}</h3>
                  <p className="section-description">Upload documents and manage students.</p>
                </div>
                <WalletInfo />
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="upload-container">
                <h3 className="section-title">Upload Student Documents</h3>
                <UploadDocumentForm category="admin" onUpload={loadData} />
              </div>
            )}

            {activeTab === 'students' && (
              <div className="users-management-container">
                <h3 className="section-title">Manage Students</h3>
                <div className="table-container">
                  {students.length === 0 && !loading && (
                    <p style={{ color: "red", margin: "1rem 0" }}>⚠️ No students found or failed to load.</p>
                  )}
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Regd No</th>
                        <th>Email</th>
                        <th>Institute</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id}>
                          <td><span className="user-name">{student.name}</span></td>
                          <td>{student.regdNo}</td>
                          <td>{student.email}</td>
                          <td>{student.institute}</td>
                          <td><span className={`status-badge status-${student.status}`}>{student.status}</span></td>
                          <td>
                            {student.status === 'pending' && (
                              <button className="approve-button" onClick={() => handleApproveStudent(student._id)}>Approve</button>
                            )}
                            {student.status === 'active' && (
                              <button className="suspend-button" onClick={() => handleRevokeStudent(student._id)}>Revoke</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'files' && (
              <div className="files-container">
                <h3 className="section-title">All Uploaded Files</h3>
                <FileList
                  files={filteredFiles}
                  title={`Documents (${selectedType === "all" ? "All" : selectedType})`}
                  loading={loading}
                />
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
