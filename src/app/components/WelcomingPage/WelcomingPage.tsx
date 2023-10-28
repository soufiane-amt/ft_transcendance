import { ChannelJoin } from "./ChannelJoin/ChannelJoin";
import { UserInitiativeTalk } from "./UserInitiativeTalk/UserInitiativeTalk";
import { WelcomeSection } from "./WelcomeSection/WelcomeSection";
import style from './WelcomingPage.module.css';


export function WelcomingPage() {
  const userData = { username: "username", avatar: "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg"}

    return (
        <div className={style.welcoming_page}>
            <WelcomeSection/>
            <div className={style.user_initiative_talks}>
                <h5 className={style.welcoming_page_talks__title}>Start a conversation:</h5>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
                    <UserInitiativeTalk userData={userData}/>
            </div>
            <div className={style.channel_joins}>
                <h5 className={style.welcoming_page_talks__title}>Join a rooom:</h5>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
            </div>
        </div>
    )
}