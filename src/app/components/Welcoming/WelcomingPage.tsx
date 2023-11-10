import { useEffect, useState } from "react";
import { ChannelJoin } from "./ChannelJoin/ChannelJoin";
import { UserInitiativeTalk } from "./UserInitiativeTalk/UserInitiativeTalk";
import { WelcomeSection } from "./WelcomeSection/WelcomeSection";
import style from './WelcomingPage.module.css';
import { fetchDataFromApi } from "../shared/customFetch/exmple";
import { InitBubble } from "../svgs";

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

  let InitiativeComp: JSX.Element[] = [];
  if (dataToDisplay?.dmsToJoin.length > 0) {
   InitiativeComp.push(
      <div className={style.user_initiative_talks}>
        <h5 className={style.welcoming_page_talks__title}>Start a conversation:</h5>
        {dataToDisplay?.dmsToJoin.map((user: { username: string; avatar: string }) => {
          return <UserInitiativeTalk userData={{ username: user.username, avatar: user.avatar }} />;
        })}
      </div>
    );
  }
  if (dataToDisplay?.channelsToJoin.length > 0)
  {
   InitiativeComp.push(

    <div className={style.channel_joins}>
        <h5 className={style.welcoming_page_talks__title}>Join a rooom:</h5>
        {
             dataToDisplay?.channelsToJoin.map((channel:ChannelType) => {
              return <ChannelJoin channelData={channel}/>
            })
        }
    </div>)
  }
  if (InitiativeComp.length === 0)
  {
   InitiativeComp.push(
        <div className={style.welcoming_page__init_bubble}>
            <InitBubble />
            <h3>No Conversations to Join for now.</h3>
      </div>)

  }

  return (
        <div className={style.welcoming_page}>
            <WelcomeSection/>
            {InitiativeComp}
        </div>
    )
}