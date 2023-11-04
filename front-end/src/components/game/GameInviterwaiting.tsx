import React from "react";
import { Space_Mono } from "next/font/google";
import "../../styles/TailwindRef.css";
import Lottie from "react-lottie-player";
import LoadingAnimation from "../../../public/MatchMakingAnimation.json";
import newSocket from "@/components/GlobalComponents/Socket/socket";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

function InvitorWaiting({ ...props }) {
  newSocket.on("GameInvitationResponse", (response: any) => {
    props.setInvitorWaiting(false);
  });
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[4]">
      {/* this is the backdrop (the background opacity) */}
      <div className="absolute bg-black w-full h-full opacity-50 z-[4]"></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] box-border overflow-scroll  z-[5] min-h-[400px] min-w-[300px] max-h-[800px] max-w-[720px] flex items-center justify-center">
        <div className="m-auto">
          <h3
            className={`${mono.className} text-center font-bold text-red-600`}
          >
            Game Requesting ...
          </h3>
          <Lottie
            loop
            animationData={LoadingAnimation}
            play
            // style={{ width: 400, height: 400 }}
            className="w-[80%] h-auto"
          />
          <h3
            className={`${mono.className} text-center font-bold text-red-600`}
          >
            {props.Timer} S
          </h3>
        </div>
      </div>
    </div>
  );
}

export default InvitorWaiting;
