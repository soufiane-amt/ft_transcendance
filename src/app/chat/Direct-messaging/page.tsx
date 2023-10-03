'use client'
import DirectMesgMain from "../../components/direct-messaging/DirectMsgMain";
import { SessionUserProvider } from "../../context/SessionUserContext";
import { SocketProvider } from "../../context/tmSocket";
import socket from "../../socket/socket";


export default function Dm() {
  
  return (
    <>
    {/* <SocketProvider> */}
      <SessionUserProvider>
          <DirectMesgMain/>
      </SessionUserProvider>

    {/* </SocketProvider> */}
      {/* <ChannelSetting/> */}
    </>
    )
}
