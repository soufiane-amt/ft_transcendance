"use client";
import "../../styles/TailwindRef.css";
import Structure from "../Structure";
import GameLandingPage from "@/components/game/GameLandingPage";
import React, { useState, createContext, useEffect, useContext } from "react";
import GameContext from "@/components/game/GameContext";
import { io, Socket } from "socket.io-client";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import Cookies from "js-cookie";
import GameSceneComponent from "@/components/game/GameSceneComponent";
import GameDashboard from "@/components/game/GameDashboard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { GameData } from "@/components/game/interfaces/GameData";
import { GameInfo } from "@/components/game/interfaces/GameInfo";

export interface GameSettingsInterface {
  GameMode: string;
  GameTheme: string;
  GameSpeed: string;
  Oponent?: string | null;
  Roll?: string | null;
}

export default function Game() {
  const [GameLandingPageBool, SetGameLandingPageBool] = useState(true);
  const [GameDashboardBool, SetGameDashboardBool] = useState(false);
  const jwtToken: string | undefined = Cookies.get("access_token");
  const usesearchParams = useSearchParams();
  const [gameDataInfo, setgameDataInfo] = useState<GameData | null>(null);
  const router = useRouter();

  const [GameSettings, setGameSettings] = useState<GameSettingsInterface>({
    GameMode: "",
    GameTheme: "",
    GameSpeed: "",
    Oponent: null,
    Roll: null,
  });
  const [gameSocket, setGameSocket] = useState<null | Socket>(null);

  useEffect(() => {
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/Game`, {
      query: {
        token: `$bearer ${jwtToken}`,
      },
    });
    socket.on("redirect_to_game", (gameInfo: GameInfo, side: string) => {
      const gameData: GameData = {
        gameInfo,
        side,
      };
      setgameDataInfo(gameData);
      SetGameLandingPageBool(false);
      SetGameDashboardBool(true);
    });
    setGameSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const id: string | null = usesearchParams.get("id");
    if (gameSocket !== null && id !== null) {
      const payload: any = {
        game_id: id,
      };
      gameSocket.emit("requestInvitationGame", payload);
      router.replace("/game");
    }
  });

  return (
    <Structure>
      <GameContext.Provider
        value={{
          GameLandingPageBool,
          SetGameLandingPageBool,
          GameDashboardBool,
          SetGameDashboardBool,
          GameSettings,
          setGameSettings,
          gameSocket,
          newSocket,
          gameDataInfo,
          setgameDataInfo
        }}
      >
        {GameLandingPageBool === true && GameDashboardBool === false && (
          <GameLandingPage />
        )}
        {GameDashboardBool === true && GameLandingPageBool === false && (
          <GameDashboard />
        )}
      </GameContext.Provider>
    </Structure>
  );
}
