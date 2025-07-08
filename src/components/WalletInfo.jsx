import { useWallet } from "../context/WalletContext";

const WalletInfo = () => {
  const { account, connectWallet, disconnectWallet } = useWallet();

  return (
    <div style={{ padding: "0.5rem 1rem", background: "#f4f4f4", borderRadius: "8px", fontSize: "0.9rem" }}>
      {!account ? (
        <button onClick={connectWallet}>🔌 Connect Wallet</button>
      ) : (
        <div>
          <p>
            Connected as:{" "}
            <strong>
              {account.ens
                ? `${account.ens} (${account.address.slice(0, 6)}...${account.address.slice(-4)})`
                : `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
            </strong>
          </p>
          <button onClick={disconnectWallet}>❌ Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
