import { ethers } from "ethers";
import LockAbi from "../contracts/Lock.json";

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
      // Explicitly request account access first
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(lockAddress, LockAbi.abi, signer);
  } catch (err) {
    console.error("Error connecting to contract:", err);
    return null;
  } finally {
    isWalletConnecting = false;
  }
}
