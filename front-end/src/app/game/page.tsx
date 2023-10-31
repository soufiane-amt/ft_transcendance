"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import GameLandingPage from "@/components/game/GameLandingPage";
import React, { useState, createContext, useEffect, useContext } from "react";
import GameContext from "@/components/game/GameContext";
import { io, Socket } from "socket.io-client";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import Cookies from "js-cookie";
import gameDataContext, { GameData, GameDataContext } from "@/components/GlobalComponents/GameDataContext";
import GameSceneComponent from "@/components/game/GameSceneComponent";
import GameDashboard from "@/components/game/GameDashboard";

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
  const gamedatacontext : GameDataContext | null = useContext<GameDataContext | null>(gameDataContext);

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

  useEffect(() => {
      if (gamedatacontext !== null && gamedatacontext.gamePlayData !== null) {
        SetGameLandingPageBool(false);
        SetGameDashboardBool(true);
      }
  }, [])

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
