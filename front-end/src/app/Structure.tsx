"use client";

import "../styles/TailwindRef.css";
import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React, { useContext, useEffect, useState } from "react";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import GameInvitation from "@/components/GlobalComponents/GameInvitation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Structure = ({ children }: { children: React.ReactNode }) => {
  const [GameInvitationBool, setGameInvitationBool] = useState(false);
  const [GameReqData, setGameReqData] = useState();
  const [Timer, setTimer]: any = useState(0);
  const router = useRouter();

  useEffect(() => {
    newSocket.on("GameInvitation", (data) => {
      if (data) {
        setGameReqData(data);
        setGameInvitationBool(true);
        setTimer(20);
      }
    });

    newSocket.on("GameInvitationResponse", (response: any) => {
      // console.log(response);
    });

    newSocket.on("redirect_to_invitation_game", (game_id: string) => {
      router.push(`/game?id=${game_id}`);
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Timer > 0) {
        setTimer(Timer - 1);
      } else {
        clearInterval(interval);
        setGameInvitationBool(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [Timer]);

  const JwtToken = Cookies.get("access_token");

  useEffect(() => {
    const data = {
      // status: "INGAME",
      token: `Bearer ${JwtToken}`,
    };
    newSocket.emit("status", data);
  }, [JwtToken]);
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
    </main>
  );
};

export default withAuth(Structure);
