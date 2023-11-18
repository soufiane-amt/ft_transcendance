"use client";

import Structure from "@/app/Structure";
import ChannelsMain from "../../../components/Chat/Channels/ChannelsMain";
import { ChatLeftBar } from "../../../components/Chat/ChatLeftBar/ChatLeftBar";
import { SessionUserProvider } from "../../context/SessionUserContext";
import style from "../page.module.css";

export default function Channels() {
  return (
    <Structure>
      <SessionUserProvider>
        <div className={style.initial_arranging}>
          <ChatLeftBar activateShrinkMode={true} />
          <ChannelsMain />
        </div>
      </SessionUserProvider>
    </Structure>
  );
}
