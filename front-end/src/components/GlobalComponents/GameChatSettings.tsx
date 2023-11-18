"use client";
import React, { useState } from "react";
import "../../styles/TailwindRef.css";
import { Space_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";

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

function GameChatSettings({ ...props }) {
  const [imgtheme, setImgtheme] = useState("/defaultselect.png");
  const [speed, setSpeed] = useState("");
  const [Error, setError] = useState("");
  const [GameTheme, setGameTheme] = useState("");

  const slow =
    speed === "Slow" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";
  const normal =
    speed === "Normal" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";
  const fast =
    speed === "Fast" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";

  const HandleSubmit = (ev: any) => {
    if (
      GameTheme != "" &&
      speed != "" &&
      props.chatSettingsData.invitorId != "" &&
      props.chatSettingsData.inviteeId != ""
    ) {
      props.setChatSettings(false);
      props.newSocket.emit(
        "GameInvitation",
        {
          invitor_id: props.chatSettingsData.invitorId,
          invitee_id: props.chatSettingsData.inviteeId,
          mapType: GameTheme,
          speed: speed,
        },
        (response: string) => {
          if (response === "invitation has been sent") {
            ev.preventDefault();
            props.setInvitorWaiting(true);
            props.setTimer(20);
          } else {
            props.setChatSettings(false);
          }
        }
      );
    } else {
      setError("Please finish setuping your data!");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[40]">
      {/* this is the backdrop (the background opacity) */}
      <div
        className="absolute bg-black w-full h-full opacity-50 z-[40]"
        onClick={(ev) => {
          ev.preventDefault();
          props.setChatSettings(false);
        }}
      ></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] flex flex-col   p-[30px] box-border overflow-scroll items-center z-[50] min-h-[400px] min-w-[300px] max-h-[800px] max-w-[720px]">
        <div className="flex items-center w-full flex-row-reverse h-[3%] mb-[15px]">
          <img
            src="/close.png"
            alt="photo"
            className="w-[20px] h-[20px] hover:cursor-pointer mt-[-1em] mr-[-0.8em]"
            onClick={(ev) => {
              ev.preventDefault();
              props.setChatSettings(false);
            }}
          />
        </div>
        <h2
          className={`text-[#0D0149] text-center font-bold text-[15px] md:text-[20px] ${pixelfont.className}`}
        >
          choose your game settings!
        </h2>
        <div className="w-full flex flex-col items-center justify-between h-[97%]  gap-4 md:gap-4">
          {/* //////////////////////////////////////// */}
          <div className="w-full min-h-[380px] flex justify-evenly flex-col items-center">
            <div className="w-full h-fit flex items-center flex-col md:gap-4">
              <h3 className={`${mono.className}  text-[#0D0149]`}>
                Game theme
              </h3>
              <img
                src={`${imgtheme}`}
                alt="gametheme"
                className="rounded-xl  h-[140px] w-[280px] md:w-[450px] md:h-[225px]"
              />
            </div>
            <div className="w-[250px] md:w-[460px] flex items-center h-fit justify-between mt-[10px]">
              <div className="w-[61px] h-[61px]">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setImgtheme("/GameBlueTheme.png");
                    setGameTheme("Blue");
                  }}
                  className={`w-[60px]  h-[60px] hover:w-[58px] hover:h-[58px]  text-center flex items-center justify-center  bg-[#B2A4FA] border-[2px] border-[#0D0149] border-dashed ${mono.className} hover:opacity-[65%] hover:cursor-pointer rounded-full text-[13px] text-[#0D0149]`}
                >
                  Blue
                </div>
              </div>
              <div className="w-[61px] h-[61px]">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setImgtheme("/GameRedTheme.png");
                    setGameTheme("Red");
                  }}
                  className={`w-[60px]  h-[60px] hover:w-[58px] hover:h-[58px]   text-center flex items-center justify-center  bg-[#FF3230] border-[2px] border-[#0D0149] border-dashed ${mono.className} hover:opacity-[65%] hover:cursor-pointer rounded-full text-[13px] text-[#0D0149]`}
                >
                  Red
                </div>
              </div>
              <div className="w-[61px] h-[61px]">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setImgtheme("/GameRandomTheme.png");
                    setGameTheme("Random");
                  }}
                  className={`w-[60px]  h-[60px] hover:w-[58px] hover:h-[58px]   text-center flex items-center justify-center  border-[2px] border-[#0D0149]  border-dashed ${mono.className} hover:opacity-[65%] hover:cursor-pointer rounded-full text-[13px] text-[#0D0149]`}
                >
                  Random
                </div>
              </div>
            </div>
          </div>
          {/* //////////////////////////////////////// */}

          <div className="flex items-center w-full flex-col md:flex-row min-h-[130px] gap-8 justify-center">
            <div className="w-[280px] flex justify-evenly items-center flex-col  h-[150px]">
              <h3 className={`${mono.className}  text-[#0D0149]`}>Speed</h3>
              <div
                className={`w-[230px] h-[40px] bg-[#0D0149] rounded-3xl text-white flex justify-around items-center ${mono.className} `}
              >
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setSpeed("Slow");
                  }}
                  className={`w-[50%] h-[100%]  border-l-[0px] border-b-[0px] border-t-[0px] border-r-[2px] border-[#E4E7FF] border-solid flex justify-center items-center hover:cursor-pointer hover:bg-[#E4E7FF] hover:text-[#0D0149] ${slow}`}
                >
                  Slow
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setSpeed("Normal");
                  }}
                  className={`w-[50%] h-[100%]  border-l-[2px] border-b-[0px] border-t-[0px] border-r-[2px] border-[#E4E7FF] border-solid flex justify-center items-center hover:cursor-pointer hover:bg-[#E4E7FF] hover:text-[#0D0149] ${normal}`}
                >
                  Normal
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setSpeed("Fast");
                  }}
                  className={`w-[50%] h-[100%]  border-l-[2px] border-b-[0px] border-t-[0px] border-r-[0px] border-[#E4E7FF] border-solid flex justify-center items-center hover:cursor-pointer hover:bg-[#E4E7FF] hover:text-[#0D0149] ${fast}`}
                >
                  Fast
                </div>
              </div>
            </div>
          </div>
          {/* //////////////////////////////////////// */}
          <div className="min-h-[20px] flex justify-center items-center mt-[20px] text-center md:mt-0">
            <p className={`${mono.className} text-rose-700 text-sm`}>{Error}</p>
          </div>
          {/* //////////////////////////////////////// */}
          <div className="min-h-[90px] flex  w-full flex-col md:flex-row  items-center justify-evenly ">
            <div
              onClick={(ev) => {
                ev.preventDefault();
                props.setChatSettings(false);
              }}
              className={`${mono.className} font-semibold hover:opacity-50 hover:cursor-pointer`}
            >
              Cancel
            </div>
            <div
              onClick={HandleSubmit}
              className={`text-[18px] text-white font-semibold  bg-[#0D0149] px-[15px] py-[3px] rounded-xl hover:opacity-50  ${mono.className}   border-none  hover:cursor-pointer`}
            >
              submit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameChatSettings;
