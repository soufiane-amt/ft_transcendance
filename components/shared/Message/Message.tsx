import style from "./Message.module.css";
import Image from 'next/image'

// const messageContent = "Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!"
const messageContent = "Hello world!"
const avatar = "/images/avatar.png"
const isUserOnline = true;

function MessageBubble({messageContent :string}) {
  return (
    <div className={`${style.left} ${style.message_bubble} ${style.message_bubble___sent_style}`}>
      {/* <div className={`${style.right} ${style.message_bubble} ${style.message_bubble___received_style}`}> */}
      {messageContent}
    </div>
  );
}


function    AvatarUser ({messageOwnerAvatar, userVisibiliy})
{
    return (
        <div >
            <Image src={messageOwnerAvatar} alt="user avatar" width={50} height={50}/>
            <Image src={userVisibiliy} alt="visibility icon"/>
        </div>
    )
}

export default function Message() {
  return (
    <div className={style.middlePosition}>
        <AvatarUser messageOwnerAvatar={avatar} userVisibiliy={isUserOnline} />
        <div>
            <MessageBubble messageContent={messageContent}/>
            <div>16:35</div>
        </div>
    </div>
  );
}
