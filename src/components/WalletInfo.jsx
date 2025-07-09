import { useWallet } from "../context/WalletContext";
import "../css/WalletInfo.css";

const WalletInfo = () => {
  const { account, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="wallet-container">
      {!account ? (
        <button className="button" onClick={connectWallet}>🔌 Connect Wallet</button>
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
          <button className="button" onClick={disconnectWallet}>❌ Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
