"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import GameLandingPage from "@/components/game/GameLandingPage";
import React, { useState, createContext, useEffect } from "react";
import GameContext from "@/components/game/GameContext";
import GameDashboard from "@/components/game/GameDashboard";
import { io, Socket } from "socket.io-client";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import Cookies from "js-cookie";

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
  const jwtToken: string | undefined = Cookies.get('access_token');

  const [GameSettings, setGameSettings] = useState<GameSettingsInterface>({
    GameMode: "",
    GameTheme: "",
    GameSpeed: "",
    Oponent: null,
    Roll: null,
  });
  const [gameSocket, setGameSocket] = useState<null | Socket>(null);

  useEffect(() => {
    if (gameSocket === null) {
      const socket: Socket = io(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/Game`, {
        query: {
          token: `$bearer ${jwtToken}`
        }
      });
      setGameSocket(socket);
    }
    return () => {
      if (gameSocket !== null) {
        gameSocket.close();
        setGameSocket(null);
      }
    }
  }, []);

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
