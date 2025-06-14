import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import "../css/UploadDocumentForm.css";

const LIGHTHOUSE_API_KEY = import.meta.env.VITE_LIGHTHOUSE_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function UploadDocumentForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cid, setCid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCid("");

    if (!file || !title) {
      setError("Please provide both a title and a file.");
      return;
    }

    if (!LIGHTHOUSE_API_KEY) {
      setError("Missing API key. Set VITE_LIGHTHOUSE_API_KEY in your .env file.");
      return;
    }

    setLoading(true);

    try {
      // Upload to Lighthouse IPFS
      const ipfsRes = await lighthouse.upload([file], LIGHTHOUSE_API_KEY);
      const newCid = ipfsRes?.data?.Hash;

      if (!newCid) throw new Error("CID not received from Lighthouse.");

      const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${newCid}`;
      setCid(newCid);

      // POST metadata to backend
      const backendRes = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          hash: newCid,
          url: ipfsUrl,
        }),
      });

      const clone = backendRes.clone(); // for backup if json fails

      let result;
      try {
        result = await backendRes.json(); // try to parse JSON
      } catch {
        const rawText = await clone.text(); // fallback if JSON fails
        throw new Error("Backend response was not valid JSON:\n" + rawText);
      }

      if (!backendRes.ok) {
        throw new Error(result?.error || "Failed to save document metadata.");
      }

      if (onUpload) onUpload(result.document);

      // Reset form
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <input
        type="text"
        placeholder="Enter document title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {cid && cid.length > 10 && (
        <div className="mt-3 text-sm text-green-700">
          ✅ Uploaded to IPFS:{" "}
          <a
            href={`https://gateway.lighthouse.storage/ipfs/${cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        </div>
      )}


      {error && <div className="mt-2 text-red-500 font-medium">{error}</div>}
    </form>
  );
}
