import "../css/FileList.css";
import { useState } from "react";

const FileList = ({ files = [], title = "Documents", downloadable = false }) => {
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleViewFile = (file, index) => {
    if (!file.url) {
      alert("File URL is missing.");
      return;
    }

    setLoadingIndex(index);

    try {
      // ✅ Directly open the public S3 URL in a new tab
      window.open(file.url, "_blank");
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
                const formattedDate =
                  issuedAt && !isNaN(new Date(issuedAt))
                    ? new Date(issuedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
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
                          {loadingIndex === i ? "Opening..." : "View"}
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
