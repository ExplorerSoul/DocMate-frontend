import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers"; // ✅ Ethers v6 imports
import contractABI from "../contracts/AcademicCertificate.json";
import { useWallet } from "../context/WalletContext";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOCK_CONTRACT;

const useContract = () => {
  const { account } = useWallet();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (!window.ethereum || !account) {
        setContract(null);
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum); // ✅ v6 syntax
        const signer = await provider.getSigner(); // ✅ `await` is required
        const instance = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer); // ✅ v6 syntax
        setContract(instance);
      } catch (err) {
        console.error("Failed to load contract:", err);
        setContract(null);
      }
    };

    loadContract();
  }, [account]);

  return contract;
};

export default useContract;
