import { BrowserProvider, Contract } from "ethers";
import AcademicCertificate from "../contracts/AcademicCertificate.json";

const lockAddress = import.meta.env.VITE_LOCK_CONTRACT;

let isWalletConnecting = false;

export async function getLockContract() {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    if (!isWalletConnecting) {
      isWalletConnecting = true;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    const provider = new BrowserProvider(window.ethereum); // ✅ Correct for ethers v6
    const signer = await provider.getSigner();

    return new Contract(lockAddress, AcademicCertificate.abi, signer); // ✅ Contract import used
  } catch (err) {
    console.error("Error connecting to contract:", err);
    return null;
  } finally {
    isWalletConnecting = false;
  }
}
