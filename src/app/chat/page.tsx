'use client'

import { ChannelJoin } from '../components/WelcomingPage/ChannelJoin/ChannelJoin'
import { ChannelPasswordInput } from '../components/WelcomingPage/ChannelPasswordInput/ChannelPasswordInput'
import { WelcomeSection } from '../components/WelcomingPage/WelcomeSection/WelcomeSection'
// import { UserInitiativeTalk } from '../../components/WelcomingPage/UserInitiativeTalk/UserInitiativeTalk.1'




export default function page() {
  
  const userData = { username: "username", avatar: "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg"}
  return (
    <>
        {/* <UserInitiativeTalk userData={userData}/> */}
        {/* <ChannelJoin channelData={{name : "name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "PROTECTED"}}/> */}
        {/* <ChannelPasswordInput channelData={{name : "name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg"}}/> */}
        <WelcomeSection/>
    </>
    // <ConfirmationDialog selectType={"Ban"}/>
    )
}
