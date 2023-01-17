import React, { useEffect, useState } from "react";
import { Message } from "../types";
import ChatBubble from "./ChatBubble";
import { ethers } from "ethers";

interface Props {
  account?: string;
  chatContract: ethers.Contract | undefined;
}

const Chat = ({ account, chatContract }: Props) => {
  const [textareaContent, setTextareaContent] = useState("");
  const [txnStatus, setTxnStatus] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>();

  const getMessages = async () => {
    if (!chatContract || account) return;

    const messages = await chatContract.getMessages();
    console.log("messagessssss",messages);
    //const messages = [{"sender":"0xC877CC82D3cadd73000c88B47313b5de03e49EdD","date":null,"content":"poru😀ka1"},{"sender":"xx","date":null,"content":"poruka1"},{"sender":"xx","date":null,"content":"poruka1"},{"sender":"xx","date":null,"content":"poruka1"},{"sender":"xx","date":null,"content":"poruka1"},{"sender":"xx","date":null,"content":"poruka1"},{"sender":"xx","date":null,"content":"poruka1"},{"sender":"xx","date":null,"content":"poruka2"},{"sender":"xx","date":null,"content":"poruka3"},{"sender":"xx","date":null,"content":"poruka4"}]
    setMessages(() => {
      return messages.map((w: any) => ({
        address: w.sender,
        content: w.content,
        date: w.timestamp.toNumber(),
      }));
    });
  };
  
  const setupMessageListener = (): ethers.Contract | void => {
    if (!chatContract) return;

    const msgListener = chatContract.on(
      "NewMessageEvent",
      (_style) => {
        getMessages();
      }
    );

    return msgListener;
  };

  const sendMessage = async () => {
    if (!chatContract) return;
    try {
      setTxnStatus("⌛");
      const messageTxn = await chatContract.sendMessage(textareaContent);
      await messageTxn.wait();
    } catch (e) {
      console.warn("Transaction failed with error", e);
    } finally {
      setTextareaContent("");
      setTxnStatus(null);
    }
  };

  useEffect(() => {
    if (!chatContract || messages) return;
    getMessages();
    setupMessageListener();
  }, [chatContract]);
  if(account){

  
  return (
    <div className="chat">
      <div className="chat__messages">
        {!chatContract && (
          <p className="state-message">
            Connect to the chat in order to see the messages!
          </p>
        )}
        {account && messages && messages.length === 0 && (
          <p className="state-message">There is no message to display</p>
        )}
        {messages &&
          messages.length > 0 &&
          messages.map((m, i) => (
            <ChatBubble
              key={i}
              ownMessage={m.address === account}
              address={m.address}
              message={m.content}
              timestamp={m.date}
            />
          ))}
      </div>
      {!account && (
          <p className="state-message">Connect With Metamask to chat!</p>
        )}
      <div className="chat__actions-wrapper">
        <div className="chat__input">
          <textarea
            disabled={!!txnStatus || !account}
            value={textareaContent}
            onChange={(e) => {
              setTextareaContent(e.target.value);
            }}
          ></textarea>
        </div>
        <button onClick={sendMessage} className="send-message-button" disabled={!!txnStatus || !account}>
            {txnStatus || "💬"}
          </button>
      </div>
    </div>
  );
}
return (<div></div>);
};

export default Chat;
