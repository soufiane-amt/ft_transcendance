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

{
  /* <p className="text-white">
            Welcome to our thrilling ping pong game! Whether you're a casual
            player or a seasoned pro, this is the perfect platform to showcase
            your skills and have a blast. We offer three exciting game modes to
            choose from: "Bot Mode" for solo practice against responsive AI
            opponents, "Invite Friends Mode" to challenge your friends, and
            "Matchmaking System Mode" for engaging matches within our vibrant
            community. Grab your paddle and get ready to experience the
            excitement of virtual ping pong!
          </p> */
}

// TODO: INFO COMPONENT
// LOOK FOR OTHER COMPONMENTS
