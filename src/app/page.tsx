'use client'
import { ChannelSetting } from "./components/Channels/ChannelSetting/ChannelSetting";
import { ModerationToolBox } from "./components/Channels/ModerationToolBox/ModerationToolBox";
import { UserModerationCard } from "./components/Channels/UserModerationCard/UserModerationCard";
import DirectMesgMain from "./components/direct-messaging/DirectMsgMain";
import { SessionUserProvider } from "./context/SessionUserContext";


export default function Home() {
  
  return (
    <>
     <SessionUserProvider>
         <DirectMesgMain/>
  
     </SessionUserProvider>
      {/* <ChannelSetting/> */}
    </>
    )
}
