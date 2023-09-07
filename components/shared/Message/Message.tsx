import clsx from "clsx";
import style from "./Message.module.css";
import Image from 'next/image'

// const messageContent = "Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!"
const messageContent = "Hello world!"
const avatar = "/images/avatar.png"
const sentMessage = false;
const timeStamp="16:35"


function    AvatarUser ({messageOwnerAvatar, isMessageSent})
{
    const avatarStylingClasses:string = `${style.message_header} ${isMessageSent ? style.message__switch_order : ''} `
    return (
        <div className={avatarStylingClasses}>
            <Image className={`${style.message_header__avatar} ${style.image__full_circle}`} src={messageOwnerAvatar} alt="user avatar" width={100} height={1000}/>
        </div>
    )
}
function TimeStamp ({time})
{
  return (
    <div className={`${style.time_stamp} ${style.time_stamp__font_size} ${style.time_stamp__gray}`}>
      {time}
    </div>
  )
}

function MessageBubble({messageContent :string, isMessageSent}) {
  const bubbleStylingClass = clsx ( {
    [style.message_bubble]: true,
    [style.message_bubble___sent_style]: !isMessageSent,
    [style.right_tail]: isMessageSent,
    [style.message_bubble___received_style]:isMessageSent,
    [style.left_tail]: !isMessageSent,
  });

  return (
    <div className={bubbleStylingClass} >
      {messageContent}
    </div>
  );
}

 function Message() {

  const messagePositionStyle = sentMessage ? `${style.message__to_right}` : '';
  return (
    <div className={`${style.message} ${messagePositionStyle} `}>
        <AvatarUser messageOwnerAvatar={avatar} isMessageSent={sentMessage}/>
        <div className={style.message_body}>
            <MessageBubble messageContent={messageContent} isMessageSent={sentMessage} />
            <TimeStamp time={timeStamp}/>
        </div>
    </div>
  );
}
