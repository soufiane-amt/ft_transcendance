"use client";

import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React, { useContext, useEffect, useState } from "react";
import "../styles/TailwindRef.css";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import GameInvitation from "@/components/GlobalComponents/GameInvitation";
import gameDataContext, { GameData, GameInfo } from "@/components/GlobalComponents/GameDataContext";
import { useRouter } from "next/navigation";

const Structure = ({ children }: { children: React.ReactNode }) => {
  const [GameInvitationBool, setGameInvitationBool] = useState(false);
  const [GameReqData, setGameReqData] = useState();
  const [Timer, setTimer]: any = useState(0);
  const [gamePlayData, setgamePlayData] = useState<GameData | null>(null);
  const gamedatacontext : any = useContext(gameDataContext);
  const router = useRouter();

  useEffect(() => {
    newSocket.on("GameInvitation", (data) => {
      if (data) {
        setGameReqData(data);
        setGameInvitationBool(true);
        setTimer(20);
      }
    });
    newSocket.on('redirect_to_game', (gameInfo : GameInfo, side: string) => {
      const gameData : GameData = {gameInfo, side };
      setgamePlayData(gameData);
      router.push('/Game');
    })
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
      <gameDataContext.Provider value={{gamePlayData, setgamePlayData}}>
      {children}
      </gameDataContext.Provider>
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
