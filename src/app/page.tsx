'use client'
import { ModerationToolBox } from "./components/Channels/ModerationToolBox/ModerationToolBox";
import { UserModerationCard } from "./components/Channels/UserModerationCard/UserModerationCard";
import DirectMesgMain from "./components/direct-messaging/DirectMsgMain";
import { SessionUserProvider } from "./context/SessionUserContext";


export default function Home() {
  
  // <SessionUserProvider>
  //     <DirectMesgMain/>

  // </SessionUserProvider>
  return (
    <>
      <ModerationToolBox/>
    </>
    )
}
