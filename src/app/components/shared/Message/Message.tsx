import clsx from "clsx";
import style from "./Message.module.css";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";
import {
  useUserContacts,
} from "../../../context/UsersContactBookContext";

interface MessageBubbleProps {
  messageContent: string;
  isMessageSent: boolean;
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



interface MessageProps {
  messageData: messageDto;

}

function Message({ messageData }: MessageProps) {
  
  const userContacts = useUserContacts();
  const user = userContacts.get(messageData.user_id);
  
  const sentMessage:boolean = user?.username === "samajat";
  const messagePositionStyle = sentMessage ? `${style.message__to_right}` : "";
  

  if (!user)
    return <div className={`${style.message} ${messagePositionStyle}`}>Message User owner not found</div>;


  return (
    <div className={`${style.message} ${messagePositionStyle}`}>
      <Avatar avatarSrc={user.avatar} avatarToRight={sentMessage} />
      <div className={style.message_body}>
        <span className={style.message_username__style}>
          {user.username}
        </span>
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
