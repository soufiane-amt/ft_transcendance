"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import GameLandingPage from "@/components/game/GameLandingPage";
import React, { useState, createContext, useEffect } from "react";
import GameContext from "@/components/game/GameContext";


export interface GameSettingsInterface {
  GameMode: string;
  GameTheme: string;
  GameSpeed: string;
  Oponent?: string | null;
  Roll?: string | null;
}

export default function Game() {
  const [GameLandingPageBool, SetGameLandingPage] = useState(true);
  const [GameDashboard, SetGameDashboard] = useState(false);

  const [GameSettings, setGameSettings] = useState<GameSettingsInterface>({
    GameMode: "",
    GameTheme: "",
    GameSpeed: "",
    Oponent: null,
    Roll: null,
  });


  useEffect(() => {
    console.log(GameSettings);
  }, [GameSettings]);

  return (
    <Structure>
      <GameContext.Provider
        value={{
          GameLandingPageBool,
          SetGameLandingPage,
          GameDashboard,
          SetGameDashboard,
          GameSettings,
          setGameSettings,
        }}
      >
        {GameLandingPageBool === true && GameDashboard === false && <GameLandingPage />}
      </GameContext.Provider>
    </Structure>
  );
}
