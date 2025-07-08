import "../css/FileList.css";

const FileList = ({ files = [], title = "Documents", downloadable = false }) => {
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
                const isApproved = file.isApproved ?? true; // default to true for admin uploads
                const issuedAt = file.issuedAt || file.uploadDate || file.createdAt;
                const formattedDate = issuedAt
                  ? new Date(issuedAt).toLocaleDateString()
                  : "—";
                const url = file.url || "#";

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
                          onClick={async () => {
                            const key = new URL(file.url).pathname.slice(1);
                            const token = localStorage.getItem("token");
                            const res = await fetch(`http://localhost:5000/api/files/presigned/${key}`, {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });
                            const data = await res.json();
                            if (data.url) {
                              window.open(data.url, "_blank");
                            }
                          }}
                        >
                          View
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
