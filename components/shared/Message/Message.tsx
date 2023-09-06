import style from "./Message.module.css";
import Image from 'next/image'

// const messageContent = "Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!"
const messageContent = "Hello world!"
const avatar = "/images/avatar.png"
const isUserOnline = true;

function MessageBubble({messageContent :string}) {
  return (
    // <div className={`${style.left} ${style.message_bubble} ${style.message_bubble___sent_style}`}>
      <div className={`${style.right} ${style.message_bubble} ${style.message_bubble___received_style}`}>
      {messageContent}
    </div>
  );
}


function    AvatarUser ({messageOwnerAvatar, userVisibiliy})
{
    return (
        <div className={style.message_header}>
            <Image className={`${style.message_header__avatar} ${style.image__full_circle}`} src={messageOwnerAvatar} alt="user avatar" width={100} height={1000}/>
            <div className={`${style.message_header__visibility_icon} ${style.image__full_circle}`}/>
        </div>
    )
}

export default function Message() {
  return (
    <div className={style.middlePosition}>
        <AvatarUser messageOwnerAvatar={avatar} userVisibiliy={isUserOnline} />
        {/* <div>
            <MessageBubble messageContent={messageContent}/>
            <div>16:35</div>
        </div> */}
    </div>
  );
}
