"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import GameLandingPage from "@/components/game/GameLandingPage";
import React, { useState, createContext } from "react";
import GameContext from "@/components/game/GameContext";


export default function Game() {
  const [GameLandingPageBool, SetGameLandingPage] = useState(true);
  const [GameDashboard, SetGameDashboard] = useState(false);

  const [GameMode, setGameMode] = useState("");
  const [GameTheme, setGameTheme] = useState("");
  const [GameSpeed, setGameSpeed] = useState("");
  const [Oponent_id, setOponent_id] = useState("");
  const [Roll, setRoll] = useState("");

  return (
    <Structure>
      <GameContext.Provider
        value={{
          GameLandingPageBool,
          SetGameLandingPage,
          GameDashboard,
          SetGameDashboard,
          GameMode,
          setGameMode,
          GameTheme,
          setGameTheme,
          GameSpeed,
          setGameSpeed,
          Oponent_id,
          setOponent_id,
          Roll,
          setRoll,
        }}
      >
        {GameLandingPageBool === true && <GameLandingPage />}
      </GameContext.Provider>
    </Structure>
  );
}
