'use client'
import { ChatLeftBar } from "../../components/ChatLeftBar/ChatLeftBar";
import DirectMesgMain from "../../components/direct-messaging/DirectMsgMain";
import { SessionUserProvider } from "../../context/SessionUserContext";
import style from '../page.module.css';


export default function Dm() {
  
  return (
      <SessionUserProvider >
        <div className={style.initial_arranging}>
            <ChatLeftBar activateShrinkMode={true}/>
            <DirectMesgMain/>
        </div>
      </SessionUserProvider>
    )
}
