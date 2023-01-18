import React, { useState,useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import SkyAnomChatArtifact from "./contract/SkyAnomChat-artifact.json";
import useChatContract from "./contract/SkyAnomChatContract";
import LogoSection from "./components/LogoSection";

function App() {
  const contractAddress = "0x74f6ee0990F7F08934Ba8f3614a58e49d9ad68B5";
  const [account, setAccount] = useState<string>();

  const [adminAddress, setAdminAddress] = useState<string>();

  const getAdminAddress = async () => {
    if (!chatContract || account) return;

    const adminAddress = await chatContract.getAdmin();
      setAdminAddress(() => {
        return adminAddress;
      });
  };

  const chatContract = useChatContract(
    contractAddress,
    SkyAnomChatArtifact.abi,
    account
  );

  useEffect(() => {
    if (!chatContract) return;
    getAdminAddress();
  }, [chatContract]);
  return (
    <div className="wrapper">
      <LogoSection />
      <Login setAccount={setAccount} account={account} />
      <Chat account={account} chatContract={chatContract} />
      {(account === adminAddress && account) &&
        <AdminPanel account={account} chatContract={chatContract} />
      }
    </div>
  );
}

export default App;
