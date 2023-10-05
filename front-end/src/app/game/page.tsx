"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import { useState } from "react";
import { Press_Start_2P } from "next/font/google";
import { Space_Mono } from "next/font/google";
import BackgroundCircleMedium from "@/components/HomePage/BackroundCirclesMedium";

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

export default function Game() {
  const [GameLandingPage, SetGameLandingPage] = useState(null);

  return (
    <Structure>
      {GameLandingPage === null && (
        <div className="bg-[#0D0149] max-w-[100vw] min-h-[calc(100vh-91px)] flex  items-center flex-col p-[3%] box-border  justify-between overflow-hidden">
          <div className="flex items-center flex-col w-full z-[1] mt-[20px]">
            <h2
              className={`text-white text-center font-bold text-[25px] md:text-[40px] ${pixelfont.className}`}
            >
              Game Play!
            </h2>
            <div className="flex w-full items-center justify-end">
              <img
                src="Info.png"
                alt="info picture"
                style={{ height: "30px", width: "30px" }}
                className=" hover:opacity-[65%] hover:cursor-pointer z-[1]"
              />
            </div>
          </div>

          <div className="w-full h-fit flex justify-center items-center relative z-[1]">
            <BackgroundCircleMedium />
            <img
              src="GameBoys1.svg"
              alt="game"
              className="z-[1] xl:h-[550px] xl:w-[550px] md:h-[500px] md:w-[500px] w-[300px] h-[300px]"
            />
          </div>
          <div className="flex flex-col text-white w-full h-fit justify-center items-center gap-6 md:flex-row md:gap-16 xl:gap-24 mb-[25px]">
            <div
              className={`w-[180px] h-[30px]  text-center flex items-center justify-center text-[#E8DE28]  border-[2px] border-[#E8DE28] border-solid ${mono.className} hover:opacity-[65%] hover:cursor-pointer z-[1] `}
            >
              Practice Mode
            </div>
            <div
              className={`w-[180px] h-[30px]  text-center flex items-center justify-center text-[#22EAAC]  border-[2px] border-[#22EAAC] border-solid  ${mono.className} hover:opacity-[65%] hover:cursor-pointer z-[1] `}
            >
              Multiplayer Mode
            </div>
            <div
              className={`w-[180px] h-[30px]  text-center flex items-center justify-center text-[#DA343E]  border-[2px] border-[#DA343E] border-solid   ${mono.className} hover:opacity-[65%] hover:cursor-pointer z-[1] `}
            >
              Matchmaking Mode
            </div>
          </div>
        </div>
      )}
    </Structure>
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
