import { useState } from "react";
import "../css/VerifyDocumentForm.css";


export default function VerifyDocumentForm() {
  const [certUUID, setCertUUID] = useState("");
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certUUID, hash }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="verify-form p-4 border rounded shadow-md max-w-md mx-auto">
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter Certificate UUID"
          value={certUUID}
          onChange={(e) => setCertUUID(e.target.value)}
          className="w-full mb-2 border px-2 py-1"
          required
        />
        <input
          type="text"
          placeholder="Enter Document Hash (CID)"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="w-full mb-2 border px-2 py-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Verify Document
        </button>
      </form>

      {result && (
        <div className="mt-4">
          <p className={`result ${result.verified ? "success" : "error"}`}>
            {result.verified
              ? "✅ Document Verified on Blockchain"
              : "❌ Hash Mismatch. Document is not valid."}
          </p>

          <p><strong>Issuer:</strong> {result.issuer}</p>
          <p><strong>Student:</strong> {result.student}</p>
          <p><strong>Issued At:</strong> {result.issuedAt}</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
