'use client'

import { ChannelJoin } from '../../components/Create-channel/ChannelJoin/ChannelJoin'
import { CommunicationInitiative } from '../../components/Create-channel/CommunicationInitiative/CommunicationInitiative.1'




export default function page() {
  
  const userData = { username: "username", avatar: "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg"}
  return (
    <>
        {/* <CommunicationInitiative userData={userData}/> */}
        <ChannelJoin channelData={{name : "name", picture : "http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg", type : "type"}}/>
    </>
    // <ConfirmationDialog selectType={"Ban"}/>
    )
}
