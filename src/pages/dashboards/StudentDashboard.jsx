import { useState, useEffect } from 'react';
import { Download, FileText, User } from 'lucide-react';
import FileList from '../../components/FileList';
import { useWallet } from '../../context/WalletContext.jsx';
import { useNavigate } from "react-router-dom";
import '../../css/StudentDashboard.css';
import { blockchainService } from '../../services/blockchain';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [myFiles, setMyFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { account } = useWallet();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'downloads', label: 'Downloads', icon: Download }
  ];

  // ✅ Decode JWT to check expiry
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

  // ✅ Logout function
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
    navigate("/login/student");
  };

  // ✅ Check token validity on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!user || user.role !== "student" || !token) {
      logoutUser();
      return;
    }

    if (token && tokenExpiry) {
      const now = Date.now() / 1000;
      if (now >= parseInt(tokenExpiry)) {
        console.warn('⚠️ Token expired. Logging out.');
        logoutUser();
      } else {
        const timeLeft = (parseInt(tokenExpiry) - now) * 1000;
        setTimeout(() => {
          console.warn('⚠️ Auto-logout triggered due to token expiry');
          logoutUser();
        }, timeLeft);
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      await loadMyFiles();
    };
    loadData();

    const intervalId = setInterval(() => {
      loadMyFiles();
    }, 15000); // refresh every 15s

    return () => clearInterval(intervalId);
  }, [account]);

  const loadMyFiles = async () => {
    setLoading(true);
    try {
      const data = await blockchainService.getMyDocuments();
      setMyFiles(data.documents || []);
    } catch (err) {
      console.error("❌ Failed to load documents:", err.message);
      // ✅ If token expired or unauthorized, logout
      if (err.response?.status === 401) {
        logoutUser();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setNavOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="student-dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="dashboard-title">
              <User className="title-icon" />
              <h1 className="title-text">
                {user.name ? `${user.name}'s Dashboard` : "Student Dashboard"}
              </h1>
            </div>
          </div>

          <nav className="desktop-nav">
            {tabItems.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`nav-button ${activeTab === tab.id ? 'nav-button-active' : ''}`}
                  aria-label={tab.label}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setNavOpen(!navOpen)}
            className="mobile-menu-button"
            aria-label="Toggle menu"
          >
            {navOpen ? "✖" : "☰"}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
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
                    onClick={() => handleTabClick(tab.id)}
                    className={`mobile-nav-button ${activeTab === tab.id ? 'mobile-nav-button-active' : ''}`}
                    aria-label={tab.label}
                  >
                    <Icon className="mobile-nav-icon" />
                    <span className="mobile-nav-label">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">My Documents</p>
              <p className="stat-value">{myFiles.length}</p>
            </div>
            <div className="stat-icon stat-icon-blue">
              <FileText />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Verified Docs</p>
              <p className="stat-value">
                {myFiles.filter(f => f.isApproved !== false).length}
              </p>
            </div>
            <div className="stat-icon stat-icon-green">
              <FileText />
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-container">
                <div className="welcome-section">
                  <h3 className="section-title">Welcome to Your Dashboard</h3>
                  <p className="section-description">
                    Manage your academic documents and download marksheets securely.
                  </p>
                </div>

                <div className="overview-grid">
                  <div className="quick-actions-card">
                    <h4 className="card-title">Quick Actions</h4>
                    <div className="action-list">
                      <button
                        className="action-link"
                        onClick={() => setActiveTab('downloads')}
                      >
                        → Download Latest Marksheet
                      </button>
                    </div>
                  </div>

                  <div className="activity-card">
                    <h4 className="card-title">Recent Activity</h4>
                    <div className="activity-list">
                      {myFiles.length === 0 ? (
                        <p className="empty-text">No recent activity</p>
                      ) : (
                        myFiles.slice(0, 3).map((file, i) => (
                          <p key={file._id || i}>
                            • {file.title || `Document #${i + 1}`} uploaded on{' '}
                            {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="downloads-container">
                <h3 className="section-title">Available Downloads</h3>
                {loading ? (
                  <p>Loading documents...</p>
                ) : (
                  <FileList
                    files={myFiles.filter(f => f.isApproved !== false)}
                    title="Verified Documents"
                    downloadable={true}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
