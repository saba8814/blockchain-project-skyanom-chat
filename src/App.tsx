import React, { useState,useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import SkyAnomChatArtifact from "./contract/SkyAnomChat-artifact.json";
import ChatContract from "./contract/SkyAnomChatContract";
import LogoSection from "./components/LogoSection";

function App() {
  const contractAddress = "0x74f6ee0990F7F08934Ba8f3614a58e49d9ad68B5";
  const [account, setAccount] = useState<string>();
  const [adminAddress, setAdminAddress] = useState<string>();
  const [isUserBanned, setIsUserBanned] = useState<boolean|null>(null);

  const getAdminAddress = async () => {
    if (!chatContract) return;

    const adminAddress = await chatContract.getAdmin();
      setAdminAddress(() => {
        return adminAddress;
      });
  };

  const checkIsUserBanned = async () =>{
    if(!chatContract) return;

    const isBanned = false;
    setIsUserBanned(() => {
      return isBanned;
    });
  }
  const chatContract = ChatContract(
    contractAddress,
    SkyAnomChatArtifact.abi,
    account
  );

  useEffect(() => {
    if (!chatContract) return;
    getAdminAddress();
  }, [chatContract]);

  useEffect(()=>{
    if (!chatContract) return;
    checkIsUserBanned();
  },[account])

  return (
    <div className="wrapper">
      <LogoSection />
      <Login setAccount={setAccount} account={account} />
      {!isUserBanned&&
        <div>
            <Chat account={account} chatContract={chatContract} />
          {(account === adminAddress && adminAddress!=undefined) &&
            <AdminPanel account={account} chatContract={chatContract} />
          }
        </div>
      }
      {isUserBanned &&
        <h1 className="error-log">THIS ACCOUNT IS BANNED!</h1>
      }
    </div>
  );
}

export default App;
