import React from "react";
import { ethers } from "ethers";
import useIsMetaMaskInstalled from "../contract/MetaMask";
import "./css/Login.css"

interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
  account?: string;
}

const Login = ({ setAccount, account }: Props) => {
  const isMetaMaskInstalled = useIsMetaMaskInstalled();

  const handleOnConnect = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        setAccount(ethers.utils.getAddress(accounts[0]));
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <div className="login-wrapper">
      {account && (
        <>
          <b>You are connected using following address:</b>
          <br />
          <small>{account}</small>
        </>
      )}
      {(!account && isMetaMaskInstalled) && (
        <button onClick={handleOnConnect} className="login-button" disabled={!isMetaMaskInstalled}>
          Login using 🦊
        </button>
      )}
      {!isMetaMaskInstalled && <h1 className="error-log">Please install MetaMask</h1>}
    </div>
  );
};

export default Login;
