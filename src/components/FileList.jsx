import "../css/FileList.css";
import { useState } from "react";

const FileList = ({ files = [], title = "Documents", downloadable = false }) => {
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleViewFile = async (file, index) => {
    setLoadingIndex(index);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      // ✅ Prefer s3Key if available, fallback to extracting from URL
      const key = file.s3Key || new URL(file.url).pathname.slice(1);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/files/presigned/${encodeURIComponent(key)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        alert(data.error || "Failed to fetch document URL");
      }
    } catch (error) {
      console.error("❌ View file error:", error);
      alert("Something went wrong while opening the document.");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="file-list-container">
      <h4 className="file-list-title">{title}</h4>

      {files.length === 0 ? (
        <p className="no-files">📂 No documents available.</p>
      ) : (
        <div className="file-list-wrapper">
          <table className="file-list-table">
            <thead>
              <tr>
                <th className="title">Title</th>
                <th className="title">Status</th>
                <th className="title">Issued On</th>
                {downloadable && <th className="title">Action</th>}
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => {
                const title = file.title || file.name || `Document #${i + 1}`;
                const isApproved = file.isApproved ?? true;
                const issuedAt = file.issuedAt || file.uploadDate || file.createdAt;
                const formattedDate = issuedAt
                  ? new Date(issuedAt).toLocaleDateString()
                  : "—";

                return (
                  <tr key={file._id || i}>
                    <td>{title}</td>
                    <td className={isApproved ? "status-verified" : "status-pending"}>
                      {isApproved ? "✔ Verified" : "⏳ Pending"}
                    </td>
                    <td>{formattedDate}</td>
                    {downloadable && (
                      <td>
                        <button
                          className="file-view-link"
                          onClick={() => handleViewFile(file, i)}
                          disabled={loadingIndex === i}
                        >
                          {loadingIndex === i ? "Loading..." : "View"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileList;
