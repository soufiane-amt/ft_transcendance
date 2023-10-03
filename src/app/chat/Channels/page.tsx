'use client'

import ChannelsMain from "../../components/Channels/ChannelsMain"
import { SessionUserProvider } from "../../context/SessionUserContext"






export default function Channels() {
  
    
  return (
        <SessionUserProvider>
            <ChannelsMain/>
        </SessionUserProvider>
    )
}

// import { useEffect } from "react"
// import socket from "../../socket/socket"
// import { SocketProvider } from "../../context/tmSocket"


// export default function Lol() {
  
//     useEffect( ()=>{
        
//         socket.on ("newMessage", ()=>{
//             console.log ("slm")
//             console.log ("--------Socket-------", socket.id)
//         })
//     },[])
    
//   return (
//     <>
//             hello world
//     </>
//     )
// }
