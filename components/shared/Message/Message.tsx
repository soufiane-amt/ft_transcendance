import clsx from "clsx";
import style from "./Message.module.css";
import Avatar from "../Avatar/Avatar";

// const messageContent = "Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!"
const messageContent = "Hello world!";
const avatar = "/images/avatar.png";
// const sentMessage = false;
const timeStamp = "16:35";

function TimeStamp({ time }) {
  return (
    <div
      className={`${style.time_stamp} ${style.time_stamp__font_size} ${style.time_stamp__gray}`}
    >
      {time}
    </div>
  );
}

function MessageBubble({ messageContent: string, isMessageSent }) {
  const bubbleStylingClass = clsx({
    [style.message_bubble]: true,
    [style.message_bubble___sent_style]: !isMessageSent,
    [style.right_tail]: isMessageSent,
    [style.message_bubble___received_style]: isMessageSent,
    [style.left_tail]: !isMessageSent,
  });

  return <div className={bubbleStylingClass}>{messageContent}</div>;
}

function Message({ sentMessage }) {
  const messagePositionStyle = sentMessage ? `${style.message__to_right}` : "";
  return (
    <div className={`${style.message} ${messagePositionStyle} `}>
      <Avatar messageOwnerAvatar={avatar} avatarToRight={sentMessage} />
      <div className={style.message_body}>
        <span className={style.message_username__style}>samajat</span>
        <MessageBubble
          messageContent={messageContent}
          isMessageSent={sentMessage}
        />
        <TimeStamp time={timeStamp} />
      </div>
    </div>
  );
}

export default Message;
