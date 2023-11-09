"use client";
import React, { useContext } from "react";
import Lottie from "react-lottie-player";
import LoadingAnimation from "@/../public/LoadingAnimation.json";

function GameWaiting() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[40]">
      <div className="h-full w-full bg-[#ccc4f7] absolute flex items-center justify-center flex-col flex-wrap z-40 top-0 overflow-hidden">
        <Lottie
          className="h-3/5"
          animationData={LoadingAnimation}
          loop={true}
          play={true}
        />
      </div>
    </div>
  );
}

export default GameWaiting;
