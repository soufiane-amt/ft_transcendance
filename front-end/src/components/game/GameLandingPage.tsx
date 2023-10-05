"use client";
import "../../styles/TailwindRef.css";
import { Press_Start_2P } from "next/font/google";
import { Space_Mono } from "next/font/google";
import BackgroundCircleMedium from "@/components/HomePage/BackroundCirclesMedium";
import { motion } from "framer-motion";
import { useState } from "react";

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

function GameLandingPage() {
  const [info, setInfo] = useState(false);

  return (
    <div className="bg-[#0D0149] max-w-[100vw] min-h-[calc(100vh-91px)] flex  items-center flex-col p-[3%] box-border  justify-between overflow-hidden">
      <div className="flex items-center flex-col w-full z-[2] mt-[20px]">
        <h2
          className={`text-white text-center font-bold text-[25px] md:text-[40px] ${pixelfont.className}`}
        >
          Game Play!
        </h2>
        <div className="flex w-full items-center justify-end z-[2] h-fit hover:cursor-pointer">
          <img
            src="Info.png"
            alt="info picture"
            style={{ height: "30px", width: "30px" }}
            className=" hover:opacity-[65%] hover:cursor-pointer z-[2]"
            onClick={(ev) => {
              ev.preventDefault();
              setInfo(!info);
            }}
          />
        </div>
      </div>

      <motion.div
        className="w-full h-fit flex justify-center items-center relative z-[1]"
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
      >
        <BackgroundCircleMedium />
        <img
          src="GameBoys1.svg"
          alt="game"
          className="z-[1] xl:h-[550px] xl:w-[550px] md:h-[500px] md:w-[500px] w-[300px] h-[300px]"
        />
      </motion.div>
      <div className="flex flex-col text-white w-full h-fit justify-center items-center gap-6 md:flex-row md:gap-16 xl:gap-24 mb-[25px]">
        <div
          className={`w-[180px] h-[30px]  text-center flex items-center justify-center text-[#E8DE28]  border-[2px] border-[#E8DE28] border-solid ${mono.className} hover:opacity-[65%] hover:cursor-pointer z-[1] rounded-md animate-bounce `}
        >
          Practice Mode
        </div>
        <div
          className={`w-[180px] h-[30px]  text-center flex items-center justify-center text-[#22EAAC]  border-[2px] border-[#22EAAC] border-solid  ${mono.className} hover:opacity-[65%] hover:cursor-pointer z-[1] rounded-md animate-bounce `}
        >
          Multiplayer Mode
        </div>
        <div
          className={`w-[180px] h-[30px]  text-center flex items-center justify-center text-[#fa4747]  border-[2px] border-[#DA343E] border-solid   ${mono.className} hover:opacity-[65%] hover:cursor-pointer z-[1] rounded-md animate-bounce `}
        >
          Matchmaking Mode
        </div>
      </div>
      {info === true && (
        <div className="fixed inset-0 flex items-center justify-center z-[2]">
          {/* this is the backdrop (the background opacity) */}
          <div
            className="absolute bg-black w-full h-full opacity-50 z-[2]"
            onClick={(ev) => {
              ev.preventDefault();
              setInfo(false);
            }}
          ></div>
          {/* this is the main component */}
          <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] flex flex-col   p-[20px] box-border overflow-scroll items-center z-[3] min-h-[400px] min-w-[300px] max-h-[1500px] max-w-[720px]">
            <div className="flex items-center w-full flex-row-reverse h-[3%]">
              <img
                src="/close.png"
                alt="photo"
                className="w-[20px] h-[20px] hover:cursor-pointer mt-[-1em] mr-[-0.8em]"
                onClick={(ev) => {
                  ev.preventDefault();
                  setInfo(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameLandingPage;
