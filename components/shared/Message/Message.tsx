import clsx from "clsx";
import style from "./Message.module.css";
import Image from 'next/image'

// const messageContent = "Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!"
const messageContent = "Hello world!"
const avatar = "/images/avatar.png"
const sentMessage = true;



function    AvatarUser ({messageOwnerAvatar})
{
    return (
        <div className={style.message_header}>
            <Image className={`${style.message_header__avatar} ${style.image__full_circle}`} src={messageOwnerAvatar} alt="user avatar" width={100} height={1000}/>
        </div>
    )
}
function TimeStamp ()
{
  return (
    <div className={`${style.time_stamp} ${style.time_stamp__font_size} ${style.time_stamp__gray}`}>
      16:35
    </div>
  )
}

// function MessageBubble({messageContent :string, isMessageSent:boolean}) {
//   return (
//     <div className={`${style.left} ${style.message_bubble} ${style.message_bubble___sent_style}`}>
//       {/* <div className={`${style.right} ${style.message_bubble} ${style.message_bubble___received_style}`}> */}
//       {messageContent}
//     </div>
//   );
// }
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
export default function Message() {
  const messageBodyClasses = `style.message_body style.message__switch_order`;
  return (
    <div className={`${style.message}  `}>
        <AvatarUser messageOwnerAvatar={avatar} />
        <div className={messageBodyClasses}>
            <MessageBubble messageContent={messageContent} isMessageSent={sentMessage} />
            <TimeStamp/>
        </div>
    </div>
  );
}
