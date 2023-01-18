import { ethers } from "ethers";
import { useState, useEffect } from "react";

const ChatContract = (
  contractAddress: string,
  web3ChatAbi: ethers.ContractInterface,
  account?: string
): ethers.Contract | undefined => {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [webThreeProvider, setWebThreeProvider] =
    useState<ethers.providers.Web3Provider>();
  const { ethereum } = window;

  useEffect(() => {
    if (ethereum) {
      setWebThreeProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, [ethereum]);

  useEffect(() => {
    if (webThreeProvider && account) {
      setSigner(webThreeProvider.getSigner());
    }
  }, [account, webThreeProvider]);

  if (!contractAddress || !web3ChatAbi || !ethereum || !webThreeProvider)
    return;

  return new ethers.Contract(
    contractAddress,
    web3ChatAbi,
    signer || webThreeProvider
  );
};

export default ChatContract;
