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
// game settings
// game invitation 
// game await for invitaion to be accepted
// game await for matchmaking
// game canva
// online , offline , in game , multiple sessions : ps online state

