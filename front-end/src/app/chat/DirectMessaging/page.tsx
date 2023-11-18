"use client";
import Structure from "@/app/Structure";
import { ChatLeftBar } from "../../../components/Chat/ChatLeftBar/ChatLeftBar";
import DirectMesgMain from "../../../components/Chat/direct-messaging/DirectMsgMain";
import { SessionUserProvider } from "../../context/SessionUserContext";
import style from "../page.module.css";

export default function Dm() {
  return (
    <Structure>
      <SessionUserProvider>
        <div className={style.initial_arranging}>
          <ChatLeftBar activateShrinkMode={true} />
          <DirectMesgMain />
        </div>
      </SessionUserProvider>
    </Structure>
  );
}
