import React, { useState,useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import SkyAnomChatArtifact from "./contract/SkyAnomChat-artifact.json";
import useChatContract from "./useChatContract";
import LogoSection from "./components/LogoSection";

function App() {
  const contractAddress = "0x4943E79593bdcDDC3e97a7811d86df2696b830aa";
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
    <div className="App">
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
