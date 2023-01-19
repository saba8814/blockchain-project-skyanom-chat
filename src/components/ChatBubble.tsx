import React from "react";
import "./css/ChatBubble.css"
import crypto from "crypto-js"
interface Props {
  ownMessage?: boolean;
  address: string;
  message: string;
  timestamp:string;
  decryptionKey:string;
}

const ChatBubble = ({ ownMessage, address, message, timestamp,decryptionKey }: Props) => {
  const bubblePosition = ownMessage ? "right" : "left";
  const formatDate = new Date(parseInt(timestamp)*1000).toString();
  const decryptedMessage = crypto.AES.decrypt(message,decryptionKey).toString(crypto.enc.Utf8);
  return (
    <div className="chat_row">
      {!ownMessage && <small className="address-text">Sent by: {address} on {formatDate}</small>}
      <div className={["chat_bubble", bubblePosition].join(" ")}>
        <div className={["chat_message", bubblePosition].join(" ")}>
          {ownMessage}
          {decryptedMessage.length===0 ? message : decryptedMessage}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
