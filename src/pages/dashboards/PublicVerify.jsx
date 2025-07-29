import { useState, useEffect } from "react";
import "../../css/PublicVerify.css";

const universities = [
  "NIT Silchar",
  "IIT Delhi",
  "IIT Kharagpur",
  "Jadavpur University",
  "Delhi University",
  "IIT Bombay",
  "NIT Trichy",
  "iitk",
  "Other",
];

export default function PublicVerify() {
  const [file, setFile] = useState(null);
  const [university, setUniversity] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filteredUniversities, setFilteredUniversities] = useState(universities);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setFilteredUniversities(
      universities.filter((u) =>
        u.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file || !university) {
      setError("Please select a university and choose a file.");
      return;
    }

    setVerifying(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "institute",
        university.trim().toLowerCase().replace(/\s+/g, "_")
      );

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="public-verify-block">
      <div className="public-verify-section">
        <h1 className="hero-title">
          Instant Document <span className="gradient-text">Verification</span>
        </h1>
        <p className="hero-description">
          Upload academic documents for any university. Tamper-proof, blockchain verified.
        </p>
      </div>

      <div className="public-verify-container">
        <h2>Single File Verification</h2>
        <p className="subtext">
          Select a university and upload a student's document to verify its authenticity.
        </p>

        <form className="verify-form" onSubmit={handleVerify}>
          {/* University Dropdown */}
          <div className="custom-dropdown">
            <div
              className="dropdown-header"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {university || "Select University"}
              <span className="dropdown-arrow">{dropdownOpen ? "▲" : "▼"}</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-body">
                <input
                  type="text"
                  placeholder="Search University..."
                  className="dropdown-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <ul className="dropdown-list">
                  {filteredUniversities.map((u) => (
                    <li
                      key={u}
                      className="dropdown-item"
                      onClick={() => {
                        setUniversity(u);
                        setDropdownOpen(false);
                      }}
                    >
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* File Upload */}
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            accept=".pdf"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="verify-button"
            disabled={!file || !university || verifying}
          >
            {verifying ? "Verifying..." : "Verify Document"}
          </button>
        </form>

        {/* ✅ Result Display */}
        {result && (
          <div
            className={`result-card ${
              result.verified ? "verified" : "unverified"
            }`}
          >
            <p>
              {result.verified
                ? "✅ Document Verified"
                : result.type === "batch"
                ? "🟡 Document Found in Batch"
                : "❌ Document Not Found"}
            </p>

            {result.certId && (
              <p>
                <strong>Cert ID:</strong> {result.certId}
              </p>
            )}

            {result.studentId && (
              <p>
                <strong>Student:</strong> {result.studentId}
              </p>
            )}

            {result.issuer && (
              <p>
                <strong>Issuer:</strong> {result.issuer}
              </p>
            )}

            {result.issuedAt && (
              <p>
                <strong>Issued At:</strong> {new Date(result.issuedAt).toLocaleDateString()}
              </p>
            )}

            {result.batchMerkleRoot && (
              <p>
                <strong>Batch Merkle Root:</strong> {result.batchMerkleRoot}
              </p>
            )}

            {result.txHash && (
              <p>
                <strong>Transaction:</strong>{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Etherscan
                </a>
              </p>
            )}
          </div>
        )}

        {/* ❌ Error Message */}
        {error && <p className="error-message">⚠️ {error}</p>}
      </div>
    </div>
  );
}
