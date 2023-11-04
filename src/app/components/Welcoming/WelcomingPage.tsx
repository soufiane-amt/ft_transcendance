import { use, useEffect, useState } from "react";
import { ChannelJoin } from "./ChannelJoin/ChannelJoin";
import { UserInitiativeTalk } from "./UserInitiativeTalk/UserInitiativeTalk";
import { WelcomeSection } from "./WelcomeSection/WelcomeSection";
import style from './WelcomingPage.module.css';
import { fetchDataFromApi } from "../shared/customFetch/exmple";


type DmType = {username:string, avatar:string}
export type ChannelType = {id: string
                    name:string
                    image:string
                    type:string}

interface dataToDisplayType{
    dmsToJoin: DmType[],
    channelsToJoin: ChannelType[]
}
export function WelcomingPage() {
  const [dataToDisplay, setDataToDisplay] = useState<dataToDisplayType>({dmsToJoin:[], channelsToJoin:[]});
  // const userData = { username: "username", avatar: "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg"}

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchDataFromApi(
        `http://localhost:3001/chat/channels_users_inits`
        );
        setDataToDisplay(fetchedData);
        console.log('fetchedData:',fetchedData.dmsToJoin)
    }
    fetchDataAsync();
  }, []); 
  return (
        <div className={style.welcoming_page}>
            <WelcomeSection/>
            <div className={style.user_initiative_talks}>
                <h5 className={style.welcoming_page_talks__title}>Start a conversation:</h5>
                  {
                    dataToDisplay?.dmsToJoin.map((user:{ username: string; avatar: string }) => {
                      return <UserInitiativeTalk userData={{username: user.username, avatar: user.avatar}}/>
                    })}
                    {/* <UserInitiativeTalk userData={userData}/>
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
                    <UserInitiativeTalk userData={userData}/> */}
            </div>
            <div className={style.channel_joins}>
                <h5 className={style.welcoming_page_talks__title}>Join a rooom:</h5>
                {
                    dataToDisplay?.channelsToJoin.map((channel:ChannelType) => {
                      return <ChannelJoin channelData={channel}/>
                    })
                }
                {/* <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PROTECTED"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/>
                <ChannelJoin channelData={{name : "channel name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PUBLIC"}}/> */}
            </div>
        </div>
    )
}