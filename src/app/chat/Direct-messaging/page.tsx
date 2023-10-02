'use client'
import DirectMesgMain from "../../components/direct-messaging/DirectMsgMain";
import { SessionUserProvider } from "../../context/SessionUserContext";


export default function Dm() {
  
  return (
    <>
     <SessionUserProvider>
         <DirectMesgMain/>
  
     </SessionUserProvider>
      {/* <ChannelSetting/> */}
    </>
    )
}
