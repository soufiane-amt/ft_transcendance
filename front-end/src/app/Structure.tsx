"use client";

import "../styles/TailwindRef.css";
import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React, { useContext, useEffect, useState } from "react";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import GameInvitation from "@/components/GlobalComponents/GameInvitation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import JoinLeavingGameData from "@/components/game/interfaces/JoinLeavingGameData";
import JoinLeavingGameComponent from "@/components/game/JoingLeavingGameComponent";
import InviteThroghtChatData from "@/components/game/interfaces/InviteThroghtChatData";
import InvitorWaiting from "@/components/game/GameInviterwaiting";
import GameChatSettings from "@/components/GlobalComponents/GameChatSettings";

const Structure = ({ children }: { children: React.ReactNode }) => {
  const [GameInvitationBool, setGameInvitationBool] = useState(false);
  const [GameReqData, setGameReqData] = useState();
  const [leavingGameData, setLeavingGameData] =
    useState<JoinLeavingGameData | null>(null);
  const [IsJoinLeavingGame, setIsJoinLeavingGame] = useState<boolean>(false);
  const router = useRouter();
  const [ChatSettings, setChatSettings] = useState(false);
  const [invitor, setInvitor] = useState(false);
  const [Timer, setTimer]: any = useState(0);
  const [chatSettingsData, setchatSettingsData] =
    useState<InviteThroghtChatData>({ inviteeId: "", invitorId: "" });
  const [TimerInvitorWaiting, setTimerInvitorWaiting]: any = useState(0);

  useEffect(() => {
    newSocket.on("close_leaving_game_notification_model", () => {
      setTimer(0);
      setIsJoinLeavingGame(false);
    });
    newSocket.on("GameInvitation", (data) => {
      if (data) {
        setGameReqData(data);
        setGameInvitationBool(true);
        setTimer(20);
      }
    });

    newSocket.on("close_game_invitation_model", () => {
      setGameInvitationBool(false);
      setTimer(0);
    });

    newSocket.on("redirect_to_invitation_game", (game_id: string) => {
      router.push(`/game?id=${game_id}`);
    });
    newSocket.on("joining_leaving_game", (payload: JoinLeavingGameData) => {
      setIsJoinLeavingGame(true);
      setLeavingGameData(payload);
      const remainingTime: number = Math.floor(payload.remainingTime / 1000);
      setTimer(remainingTime);
    });

    newSocket.on(
      "show_settings_component",
      (payload: InviteThroghtChatData) => {
        console.log("test");
        if (payload) {
          setchatSettingsData({ ...payload });
          setChatSettings(true);
        }
      }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Timer > 0) {
        setTimer(Timer - 1);
      } else {
        clearInterval(interval);
        if (GameInvitationBool === true) {
          setGameInvitationBool(false);
        }
        if (IsJoinLeavingGame === true) {
          setIsJoinLeavingGame(false);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [Timer]);

  const JwtToken = Cookies.get("access_token");

  useEffect(() => {
    newSocket.emit("get_status", (response: string) => {
      if (response !== "IN_GAME") {
        const data = {
          token: `Bearer ${JwtToken}`,
        };
        newSocket.emit("status", data);
      }
    });
  }, [JwtToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (TimerInvitorWaiting > 0) {
        setTimerInvitorWaiting(TimerInvitorWaiting - 1);
      } else {
        clearInterval(interval);
        setInvitor(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [TimerInvitorWaiting]);

  return (
    <main>
      <NavBar />
      {children}
      {GameInvitationBool && (
        <GameInvitation
          data={GameReqData}
          State={setGameInvitationBool}
          Timer={Timer}
        />
      )}
      {IsJoinLeavingGame && (
        <JoinLeavingGameComponent
          data={leavingGameData}
          State={setIsJoinLeavingGame}
          Timer={Timer}
        />
      )}
      {ChatSettings && (
        <GameChatSettings
          newSocket={newSocket}
          chatSettingsData={chatSettingsData}
          setChatSettings={setChatSettings}
          setInvitorWaiting={setInvitor}
          setTimer={setTimerInvitorWaiting}
        />
      )}
      {invitor && (
        <InvitorWaiting
          Timer={TimerInvitorWaiting}
          setInvitorWaiting={setInvitor}
        />
      )}
    </main>
  );
};

export default withAuth(Structure);
