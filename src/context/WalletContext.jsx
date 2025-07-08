import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

const WalletContext = createContext({
  account: null, // { address, ens }
  connectWallet: () => {},
  disconnectWallet: () => {},
});

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const existingAccounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      let address = existingAccounts[0];

      if (!address) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        address = accounts[0];
      }

      let ensName = null;
      if (provider && address) {
        ensName = await provider.lookupAddress(address);
      }

      setAccount({
        address,
        ens: ensName,
      });
    } catch (err) {
      console.error("MetaMask connection failed", err);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        return;
      }

      const address = accounts[0];
      const provider = new BrowserProvider(window.ethereum);
      let ensName = null;

      try {
        ensName = await provider.lookupAddress(address);
      } catch (err) {
        console.warn("ENS lookup failed:", err);
      }

      setAccount({
        address,
        ens: ensName,
      });
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
