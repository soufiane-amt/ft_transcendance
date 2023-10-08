'use client'

import ChannelActionModal from "../../components/Channels/ChannelActionModal/ChannelActionModal"
import ChannelsMain from "../../components/Channels/ChannelsMain"
import { RadioOptions } from "../../components/shared/RadioOptions/RadioOptions"
import { SessionUserProvider } from "../../context/SessionUserContext"



export default function Channels() {
  
  
  return (
    <SessionUserProvider>
        <ChannelsMain/>
    </SessionUserProvider>
    // <RadioOptions selectType={"Ban"}/>
    )
}
