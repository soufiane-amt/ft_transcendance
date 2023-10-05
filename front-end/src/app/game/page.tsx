"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import { useState } from "react";
import GameLandingPage from "@/components/game/GameLandingPage";

export default function Game() {
  const [GameLandingPageBool, SetGameLandingPage] = useState(null);

  return (
    <Structure>{GameLandingPageBool === null && <GameLandingPage />}</Structure>
  );
}

 

// TODO: INFO COMPONENT
// LOOK FOR OTHER COMPONMENTS
