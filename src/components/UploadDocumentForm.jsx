import { useState } from "react";
import { documentTypes } from "../configs/documentTypes.config";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UploadDocumentForm({ category = "academic", onUpload }) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [uploadMode, setUploadMode] = useState("single");
  const [regdNo, setRegdNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const docOptions = documentTypes[category] || [];
  const currentYear = new Date().getFullYear() % 100;

  const isValidRegdNo = (r) => {
    if (!/^\d{7}$/.test(r)) return false;
    const year = parseInt(r.slice(0, 2), 10);
    const branch = parseInt(r.slice(2, 4), 10);
    const roll = parseInt(r.slice(4), 10);
    const validBranches = [11, 12, 13, 14, 15, 16];
    return (
      year >= currentYear - 4 &&
      year <= currentYear &&
      validBranches.includes(branch) &&
      roll >= 1 &&
      roll <= 185
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    if (selectedFile.name.endsWith(".zip")) {
      setUploadMode("bulk");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file || !docType) {
      setError("Please select a document and document type.");
      return;
    }

    if (uploadMode === "single" && !isValidRegdNo(regdNo)) {
      setError("Invalid registration number.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not logged in");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      formData.append("category", category);

      if (uploadMode === "single") {
        formData.append("regdNo", regdNo);
      }

      const url =
        uploadMode === "single"
          ? `${BACKEND_URL}/api/upload/document`
          : `${BACKEND_URL}/api/upload/bulk-zip`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (uploadMode === "single") {
        alert("✅ Single document uploaded.");
        onUpload?.(data.document);
      } else {
        alert(
          `✅ ZIP Bulk upload complete. Success: ${data.successful}, Failed: ${data.failed}`
        );
      }

      // ✅ Reset form
      setFile(null);
      setRegdNo("");
      setDocType("");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <div className="form-group">
        <label className="form-label">Select Document File</label>
        <input
          type="file"
          accept=".zip,.pdf"
          onChange={handleFileChange}
          className="form-select"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Document Type</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="form-select"
        >
          <option value="">Select Document Type</option>
          <option value="marksheet">Marksheet</option>
          <option value="bonafide">Bonafide</option>
          <option value="degree">Degree</option>
          <option value="misc">Misc</option>
          {docOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Upload Mode</label>
        <select
          value={uploadMode}
          onChange={(e) => setUploadMode(e.target.value)}
          className="form-select"
        >
          <option value="single">Single Upload</option>
          <option value="bulk">Bulk Upload</option>
        </select>
      </div>

      {uploadMode === "single" && (
        <div className="form-group">
          <label className="form-label">Student Regd. No</label>
          <input
            type="text"
            placeholder="e.g. 2214134"
            value={regdNo}
            onChange={(e) => setRegdNo(e.target.value)}
            className="form-select"
          />
        </div>
      )}

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Uploading..." : "Upload Document"}
      </button>

      {error && <div className="mt-2 text-red-500 font-medium">{error}</div>}
    </form>
  );
}
