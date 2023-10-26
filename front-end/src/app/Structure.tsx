"use client";

import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React, { useEffect, useState } from "react";
import "../styles/TailwindRef.css";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import GameInvitation from "@/components/GlobalComponents/GameInvitation";

const Structure = ({ children }: { children: React.ReactNode }) => {
  const [GameInvitationBool, setGameInvitationBool] = useState(false);
  const [GameReqData, setGameReqData] = useState();
  const [Timer, setTimer]: any = useState(0);

  useEffect(() => {
    newSocket.on("GameInvitation", (data) => {
      if (data) {
        setGameReqData(data);
        setGameInvitationBool(true);
        setTimer(20);
      }
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

  return (
    <main>
      <NavBar />
      {/* <div className="h-[91px] bg-white w-full">this is nav</div> */}
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
