"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import { useState } from "react";
import GameLandingPage from "@/components/game/GameLandingPage";

export default function Game() {
  const [GameLandingPageBool, SetGameLandingPage] = useState(true);
  // const [GameDashboard, SetGameDashboard] = useState(false);
  return (
    <Structure>{GameLandingPageBool === true && <GameLandingPage />}</Structure>
  );
}
