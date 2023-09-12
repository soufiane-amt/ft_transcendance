import clsx from "clsx";
import style from "./Message.module.css";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";

// const messageContent = "Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!"
const messageContent = "Hello world!";
const avatar = "/images/avatar.png";
// const sentMessage = false;
const timeStamp = "16:35";


function MessageBubble({ messageContent, isMessageSent }) {
  const bubbleStylingClass = clsx({
    [style.message_bubble]: true,
    [style.message_bubble___sent_style]: !isMessageSent,
    [style.right_tail]: isMessageSent,
    [style.message_bubble___received_style]: isMessageSent,
    [style.left_tail]: !isMessageSent,
  });

  return <div className={bubbleStylingClass}>{messageContent}</div>;
}

function Message({ messageData, sentMessage }) {
  const messagePositionStyle = sentMessage ? `${style.message__to_right}` : "";
  return (
    <div className={`${style.message} ${messagePositionStyle}`}>
      <Avatar avatarSrc={messageData.avatar} avatarToRight={sentMessage} />
      <div className={style.message_body}>
        <span className={style.message_username__style}>{messageData.name}</span>
        <MessageBubble
          messageContent={messageData.content}
          isMessageSent={sentMessage}
        />
        <TimeStamp time={messageData.created_at} />
      </div>
    </div>
  );
}

export default Message;
