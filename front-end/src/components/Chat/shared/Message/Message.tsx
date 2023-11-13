import clsx from "clsx";
import style from "../../../../styles/ChatStyles/Message.module.css";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";
import { useUserContacts } from "../../../../app/context/UsersContactBookContext";
import { useSessionUser } from "../../../../app/context/SessionUserContext";

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
  const messageSender = userContacts.get(messageData.user_id);
  const userSession = useSessionUser();

  const sentMessage: boolean = userSession.id === messageData.user_id;

  var currentUser = sentMessage ? userSession : messageSender;
  const messagePositionStyle = sentMessage ? `${style.message__to_right}` : "";
  return (
    <>
    {currentUser &&
    <div className={`${style.message} ${messagePositionStyle}`}>
      <Avatar src={currentUser.avatar} avatarToRight={sentMessage} />
        <div className={style.message_body}>
          <span className={style.message_username__style}>
            {currentUser.username}
          </span>
          <MessageBubble
            messageContent={messageData.content}
            isMessageSent={sentMessage}
          />
          <TimeStamp time={messageData.createdAt} />
        </div>
      </div>
    }
    </>
  );
}

export default Message;
