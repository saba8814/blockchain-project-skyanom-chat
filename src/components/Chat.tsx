import React, { useEffect, useRef, useState } from "react";
import { Message } from "../types";
import ChatBubble from "./ChatBubble";
import "./css/Chat.css"
import { ethers } from "ethers";
import crypto from 'crypto-js';

interface Props {
  account?: string;
  chatContract: ethers.Contract | undefined;
}

const Chat = ({ account, chatContract }: Props) => {
  const [textareaContent, setTextareaContent] = useState("");
  const [txnStatus, setTxnStatus] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>();
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [decryptKeyInput, setDecryptionKeyInput] = useState<string>("");

  const chatParent = useRef<HTMLDivElement>(null);

  const scrollToBottomOfTheChat = () => {
    if (chatParent.current) {
      chatParent.current.scrollTop = chatParent.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottomOfTheChat();
  })

  const getMessages = async () => {
    if (!chatContract || account) return;

    const messages = await chatContract.getMessages();
    //const messages = [{ "sender": "0xC877CC82D3cadd73000c88B47313b5de03e49EdD", "date": null, "content": "poru😀ka1" }, { "sender": "xx", "date": null, "content": "poruka1" }, { "sender": "xx", "date": null, "content": "poruka1" }, { "sender": "xx", "date": null, "content": "poruka1" }, { "sender": "xx", "date": null, "content": "poruka1" }, { "sender": "xx", "date": null, "content": "poruka1" }, { "sender": "xx", "date": null, "content": "poruka1" }, { "sender": "xx", "date": null, "content": "poruka2" }, { "sender": "xx", "date": null, "content": "poruka3" }, { "sender": "xx", "date": null, "content": "poruka4" }]
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
      const messageTxn = await chatContract.sendMessage(crypto.AES.encrypt(textareaContent, decryptionKey).toString());
      await messageTxn.wait();
    } catch (e) {
      console.warn("Transaction failed with error", e);
    } finally {
      setTextareaContent("");
      setTxnStatus(null);
    }
  };
  const changeDecryptionKey = () => {
    setDecryptionKey(decryptKeyInput);
    setDecryptionKeyInput("");
  }
  useEffect(() => {
    if (!chatContract) return;
    getMessages();
    setupMessageListener();
  }, [chatContract]);
  if (account) {
    return (
      <>
        <div className="encryption-section">
          <input type="text" 
          placeholder="Enter decryption key!" 
          className="set-encryption-input"
          value={decryptKeyInput}
          onChange={(e)=>{setDecryptionKeyInput(e.target.value)}}
          />
          <button className="set-encryption-button" onClick={changeDecryptionKey}>CHANGE KEY</button>
        </div>
        <p className="state-message">
          Currently set encryption/decryption key is: <b>{decryptionKey.length==0 ? "notset" : decryptionKey} </b>
        </p>
        <div className="chat" ref={chatParent}>
          <div className="chat_messages">
            {(!chatContract || !account) && (
              <p className="state-message">
                Connect using metamask to access chat!
              </p>
            )}
            {account && messages && messages.length === 0 && (
              <p className="state-message">Chat is empty!</p>
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
                  decryptionKey={decryptionKey}
                />
              ))}

          </div>

          <div className="chat-actions-wrapper">
            <div className="chat-input">
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
      </>
    );
  }
  return (<div></div>);
};

export default Chat;
