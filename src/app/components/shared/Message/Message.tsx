import clsx from "clsx";
import style from "./Message.module.css";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";

// const messageContent = "Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!"
const messageContent = "Hello world!";
const avatar = "/images/avatar.png";
// const sentMessage = false;
const timeStamp = "16:35";

interface MessageBubbleProps{
  messageContent : string
  isMessageSent : boolean
}
function MessageBubble({ messageContent, isMessageSent }: MessageBubbleProps) {
  const bubbleStylingClass = clsx({
    [style.message_bubble]: true,
    [style.message_bubble___sent_style]: !isMessageSent,
    [style.right_tail]: isMessageSent,
    [style.message_bubble___received_style]: isMessageSent,
    [style.left_tail]: !isMessageSent,
  });

  return <div className={bubbleStylingClass}>{messageContent}</div>;
}






interface MessageProps{
  messageData :  messageDto
  sentMessage : boolean
}
function Message({ messageData, sentMessage }: MessageProps) {
  const messagePositionStyle = sentMessage ? `${style.message__to_right}` : "";
  

  return (
    <div className={`${style.message} ${messagePositionStyle}`}>
      <Avatar avatarSrc={avatar} avatarToRight={sentMessage} />
      <div className={style.message_body}>
        <span className={style.message_username__style}>{messageData.username}</span>
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
