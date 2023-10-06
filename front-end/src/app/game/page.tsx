"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import { useState } from "react";

export default function Game() {
  const [home, SetHome] = useState(undefined);

  return (
    <Structure>
      {home === undefined && (
        <div className="bg-[#0D0149] w-[100vw] content flex  items-center flex-col overflow-scroll">
          <h1 className="text-white">Game Play</h1>
          <img src="GameBoys.svg" alt="game" style={{ height: "75vh", width: "75vw"}}/>
          {/* <p className="text-white">
            Welcome to our ping pong play game! Get ready tp experience the
            thrill of virtual ping pong right from casual player or a ping pong
            pro, this is the perfect place to showcase your skills and have a
            blast. To start playing, simple choose your preferred game mode, Are
            you up for a quick practice session to warm up? Select the "Practice
            Mode" and hone your techniques against our responsive AI opponents.
            Want to challenge friends ? Click on "Multiplayer Mode" to enter our
            vibrant community and engage in exhilarating matches.
          </p> */}
          <div>
            
          </div>
        </div>
      )}
    </Structure>
  );
}
