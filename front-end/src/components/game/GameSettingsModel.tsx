"use client";
import React, { useContext, useEffect, useState } from "react";
import "../../styles/TailwindRef.css";
import { Space_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import GameContext from "./GameContext";
import Cookies from "js-cookie";
import axios from "axios";

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

function GameSettingsModel({ ...props }) {
  const [imgtheme, setImgtheme] = useState("/defaultselect.png");
  const context: any = useContext(GameContext);
  const [speed, setSpeed] = useState("");
  const [Roll, setRoll] = useState("");
  const [Error, setError] = useState("");
  const jwtToken = Cookies.get("access_token");
  const [User, setUser] = useState<any>({});

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  }, [jwtToken]);

  const slow =
    speed === "slow" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";
  const normal =
    speed === "normal" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";
  const fast =
    speed === "fast" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";
  const Host =
    Roll === "host" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";
  const Guest =
    Roll === "guest" ? "cursor-pointer bg-[#E4E7FF] text-[#0D0149]" : "";

  const HandleSubmit = (ev: any) => {
    if (
      context.GameSettings.GameMode === "Practice" &&
      context.GameSettings.GameTheme != "" &&
      context.GameSettings.GameSpeed != ""
    ) {
      props.setSettings(false);
      context.SetGameLandingPageBool(false);
      context.SetGameDashboardBool(true);
    } else if (
      context.GameSettings.GameMode === "Invite" &&
      context.GameSettings.GameTheme != "" &&
      context.GameSettings.GameSpeed != "" &&
      context.GameSettings.Oponent != null
    ) {
      props.setSettings(false);
      context.newSocket.emit(
        "GameInvitation",
        {
          invitor_id: User.id,
          invitee_id: context.GameSettings.Oponent,
          mapType: context.GameSettings.GameTheme,
          speed: context.GameSettings.GameSpeed,
        },
        (response: string) => {
          if (response === "invitation has been sent") {
            ev.preventDefault();
            props.setInvitorWaiting(true);
            props.setTimer(20);
          } else {
            props.setSettings(false);
          }
        }
      );
    } else if (
      context.GameSettings.GameMode === "Matchmaking" &&
      context.GameSettings.GameTheme != "" &&
      context.GameSettings.GameSpeed != "" &&
      context.GameSettings.Roll != null
    ) {
      props.setSettings(false);
      context.gameSocket.emit(
        "matchMaking",
        {
          mapType: context.GameSettings.GameTheme,
          speed: context.GameSettings.GameSpeed,
          role: context.GameSettings.Roll,
        },
        (response: string) => {
          if (response === "You are already in the game") {
            props.setSettings(false);
          } else {
            props.setIsMatchMakingLoading(true);
            props.setSettings(false);
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
    <div className="fixed inset-0 flex items-center justify-center z-[4]">
      {/* this is the backdrop (the background opacity) */}
      <div
        className="absolute bg-black w-full h-full opacity-50 z-[4]"
        onClick={(ev) => {
          ev.preventDefault();
          props.setSettings(false);
        }}
      ></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] flex flex-col   p-[30px] box-border overflow-scroll items-center z-[5] min-h-[400px] min-w-[300px] max-h-[800px] max-w-[720px]">
        <div className="flex items-center w-full flex-row-reverse h-[3%] mb-[15px]">
          <img
            src="/close.png"
            alt="photo"
            className="w-[20px] h-[20px] hover:cursor-pointer mt-[-1em] mr-[-0.8em]"
            onClick={(ev) => {
              ev.preventDefault();
              props.setSettings(false);
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
                    context.setGameSettings({
                      ...context.GameSettings,
                      GameTheme: "Blue",
                    });
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
                    context.setGameSettings({
                      ...context.GameSettings,
                      GameTheme: "Red",
                    });
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
                    context.setGameSettings({
                      ...context.GameSettings,
                      GameTheme: "Random",
                    });
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
            {props.isMatchMaking && (
              <div className="w-[250px] flex justify-evenly items-center flex-col h-[150px] ">
                <h3 className={`${mono.className}  text-[#0D0149]`}>Roll</h3>
                <div
                  className={`w-[160px] h-[40px] bg-[#0D0149] rounded-3xl text-white flex justify-around items-center ${mono.className} `}
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      context.setGameSettings({
                        ...context.GameSettings,
                        Roll: "Host",
                      });
                      setRoll("host");
                    }}
                    className={`w-[50%] h-[100%]  border-l-[0px] border-b-[0px] border-t-[0px] border-r-[2px] border-[#E4E7FF] border-solid flex justify-center items-center hover:cursor-pointer hover:bg-[#E4E7FF] hover:text-[#0D0149] ${Host}`}
                  >
                    Host
                  </div>

                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      context.setGameSettings({
                        ...context.GameSettings,
                        Roll: "Guest",
                      });
                      setRoll("guest");
                    }}
                    className={`w-[50%] h-[100%]  border-l-[2px] border-b-[0px] border-t-[0px] border-r-[0px] border-[#E4E7FF] border-solid flex justify-center items-center hover:cursor-pointer hover:bg-[#E4E7FF] hover:text-[#0D0149] ${Guest}`}
                  >
                    Guest
                  </div>
                </div>
              </div>
            )}
            <div className="w-[280px] flex justify-evenly items-center flex-col  h-[150px]">
              <h3 className={`${mono.className}  text-[#0D0149]`}>Speed</h3>
              <div
                className={`w-[230px] h-[40px] bg-[#0D0149] rounded-3xl text-white flex justify-around items-center ${mono.className} `}
              >
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    context.setGameSettings({
                      ...context.GameSettings,
                      GameSpeed: "Slow",
                    });
                    setSpeed("slow");
                  }}
                  className={`w-[50%] h-[100%]  border-l-[0px] border-b-[0px] border-t-[0px] border-r-[2px] border-[#E4E7FF] border-solid flex justify-center items-center hover:cursor-pointer hover:bg-[#E4E7FF] hover:text-[#0D0149] ${slow}`}
                >
                  Slow
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setSpeed("normal");
                    context.setGameSettings({
                      ...context.GameSettings,
                      GameSpeed: "Normal",
                    });
                  }}
                  className={`w-[50%] h-[100%]  border-l-[2px] border-b-[0px] border-t-[0px] border-r-[2px] border-[#E4E7FF] border-solid flex justify-center items-center hover:cursor-pointer hover:bg-[#E4E7FF] hover:text-[#0D0149] ${normal}`}
                >
                  Normal
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setSpeed("fast");
                    context.setGameSettings({
                      ...context.GameSettings,
                      GameSpeed: "Fast",
                    });
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
                props.setSettings(false);
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

export default GameSettingsModel;
