"use client";
import React, { useContext } from "react";
import { Button } from "antd";
import { Press_Start_2P } from "next/font/google";
import { Space_Mono } from "next/font/google";
import { motion } from "framer-motion";

const mono = Space_Mono({
  preload: false,
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

const pixelfont = Press_Start_2P({
  preload: false,
  subsets: ["latin"],
  weight: ["400"],
});

function GameResult(props: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[40] w-[100vw] h-[100vh] overflow-hidden text-indigo-100 ">
      <div className="absolute bg-black w-full h-full opacity-50 z-[4]"></div>
      {/* <div className="h-full w-full bg-indigo-100 absolute flex items-center  justify-center gap-12 flex-col flex-wrap z-40 top-0 overflow-hidden"> */}
      <motion.div
        className="h-full w-full  flex items-center  justify-center gap-12 flex-col flex-wrap  top-0 overflow-hidden absolute z-[5]"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 2.5,
        }}
      >
        <h2
          className={`text-3xl  md:text-5xl lg:text-6xl xl:text-8xl ${pixelfont.className}`}
        >
          Game Over
        </h2>
        <h3
          className={`text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ${mono.className} m-[50px]`}
        >
          {props.result === "win" ? "YOU WIN!" : "YOU LOSE!"}
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-evenly min-h-[40px] w-1/2 gap-3">
          <Button className="mt-5" size="large" type="primary" danger>
            Try Again
          </Button>
          <Button className="mt-5" size="large" type="primary">
            Back Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default GameResult;
