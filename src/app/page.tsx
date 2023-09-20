'use client'
import DirectMesgMain from "./components/direct-messaging/DirectMsgMain";
import { SessionUserProvider } from "./context/SessionUserContext";


export default function Home() {

  return (
    <SessionUserProvider>
        <DirectMesgMain/>

    </SessionUserProvider>
    )
}
