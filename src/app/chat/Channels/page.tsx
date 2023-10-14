'use client'

import ChannelActionModal from "../../components/Channels/ChannelActionModal/ChannelActionModal"
import ChannelsMain from "../../components/Channels/ChannelsMain"
import { SessionUserProvider } from "../../context/SessionUserContext"



export default function Channels() {
  
  
  return (
    <SessionUserProvider>
        <ChannelsMain/>
    </SessionUserProvider>
    // <ConfirmationDialog selectType={"Ban"}/>
    )
}
