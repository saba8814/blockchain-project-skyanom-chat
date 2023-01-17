import React from "react";

interface Props {
  ownMessage?: boolean;
  address: string;
  message: string;
  timestamp:string;
}

const ChatBubble = ({ ownMessage, address, message, timestamp }: Props) => {
  const bubblePosition = ownMessage ? "right" : "left";
  const formatDate = new Date(parseInt(timestamp)*1000).toString();

  return (
    <div className="chat__row">
      {!ownMessage && <small className="address-text">Sent by: {address} on {formatDate}</small>}
      <div className={["chat__bubble", bubblePosition].join(" ")}>
        <div className={["chat__message", bubblePosition].join(" ")}>
          {ownMessage}
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
