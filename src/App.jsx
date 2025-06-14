import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { getLockContract } from "./utils/contract";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DocumentPage from "./pages/DocumentPage";
import DocumentList from "./components/DocumentList";
import VerifyDocumentForm from "./components/VerifyDocumentForm"; // ✅ updated

import "./css/App.css";

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  // 🔗 Wallet connection + smart contract init
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        const instance = await getLockContract();
        setContract(instance);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet.");
    }
  };

  // 📤 After successful document upload
  const handleUpload = async (doc) => {
    setDocuments((prev) => [...prev, doc]);
    // Optionally trigger on-chain storage here
  };

  return (
    <div className="main-section">
      <Navbar />

      <div className="wallet-section" style={{ padding: "1rem" }}>
        {walletAddress ? (
          <span className="text-green-600">🔗 Connected: {walletAddress}</span>
        ) : (
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Home />

              <section>
                <h2 className="section-title">Uploaded Documents</h2>
                <div className="upload-div">
                  <DocumentList documents={documents} />
                </div>
              </section>

              <section>
                <h2 className="section-title">Verify Document</h2>
                <div className="verify-div">
                  <VerifyDocumentForm />
                </div>
              </section>
            </main>
          }
        />

        <Route
          path="/upload"
          element={<DocumentPage onUpload={handleUpload} />}
        />
      </Routes>
    </div>
  );
}
