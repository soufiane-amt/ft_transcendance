"use client";

import { ChatLeftBar } from "../../components/Chat/ChatLeftBar/ChatLeftBar";
import { WelcomingPage } from "../../components/Chat/Welcoming/WelcomingPage";
import Structure from "../Structure";
import { SessionUserProvider } from "../context/SessionUserContext";
import style from "./page.module.css";

export default function page() {
  return (
    <Structure>
      <div className={style.initial_arranging}>
        <ChatLeftBar activateShrinkMode={false} />
        <WelcomingPage />
      </div>
    </Structure>
  );
}
