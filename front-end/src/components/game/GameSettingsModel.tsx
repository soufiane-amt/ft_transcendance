import React, { useState } from "react";
import "../../styles/TailwindRef.css";
import { Space_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

function GameSettingsModel({ ...props }) {
  const [imgtheme, setImgtheme] = useState("/GameBlueTheme.png");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2]">
      {/* this is the backdrop (the background opacity) */}
      <div
        className="absolute bg-black w-full h-full opacity-50 z-[2]"
        onClick={(ev) => {
          ev.preventDefault();
          props.setSettings(false);
        }}
      ></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] flex flex-col   p-[30px] box-border overflow-scroll items-center z-[3] min-h-[400px] min-w-[300px] max-h-[1500px] max-w-[720px]">
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
          className={`text-[#0D0149] text-center font-bold text-[15px] md:text-[20px] ${pixelfont.className} mb-[15px]`}
        >
          choose your game settings!
        </h2>
        <div className="w-full flex flex-col items-center justify-between h-[97%] gap-4">
          {/* //////////////////////////////////////// */}

          <div className="w-full min-h-[320px] flex justify-evenly flex-col items-center">
            <h3 className={`${mono.className}  text-[#0D0149] mb-[5px]`}>
              Game theme :
            </h3>
            <div className="w-full h-fit flex justify-center items-center">
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
                  }}
                  className={`w-[60px]  h-[60px] hover:w-[58px] hover:h-[58px]   text-center flex items-center justify-center  border-[2px] border-[#0D0149]  border-dashed ${mono.className} hover:opacity-[65%] hover:cursor-pointer rounded-full text-[13px] text-[#0D0149]`}
                >
                  Random
                </div>
              </div>
            </div>
          </div>
          {/* //////////////////////////////////////// */}
          <div className="flex justify-between items-center w-full flex-col  min-h-[130px]">
            <h3 className={`${mono.className}  text-[#0D0149]`}>
              Game speed :
            </h3>
            <div className="w-[45%] h-[45px] bg-[#0D0149] rounded-lg flex flex-col justify-center items-center text-white min-w-[260px]">
              <div className="w-full flex items-center mt-[-55px] mb-[20px] gap-[30%] justify-center">
                <span
                  className={`h-[35px] w-[35px] bg-red-600 ${mono.className} top-[-50px]  left-[8%] text-white  z-[2] rounded-tl-full rounded-tr-full rounded-bl-full flex justify-center items-center rotate-[50deg]`}
                >
                  S
                </span>
                <span
                  className={`h-[35px] w-[35px] bg-red-600 ${mono.className} top-[-50px]  right-[50%] text-white  z-[2] rounded-tl-full rounded-tr-full rounded-bl-full flex justify-center items-center rotate-[50deg]`}
                >
                  N
                </span>
                <span
                  className={`h-[35px] w-[35px] bg-red-600 ${mono.className} top-[-50px]  right-[8%] text-white  z-[2] rounded-tl-full rounded-tr-full rounded-bl-full flex justify-center items-center rotate-[50deg]`}
                >
                  F
                </span>
              </div>
              <div className="w-full flex justify-around items-center relative">
                <input
                  type="range"
                  min="0"
                  max="2"
                  defaultValue="1"
                  step="1"
                  className="w-[90%] h-[14px] bg-white rounded-full outline-none border-none appearance-none "
                />
              </div>
            </div>
          </div>
          {/* //////////////////////////////////////// */}
          <div className="min-h-[80px] flex  w-full flex-col md:flex-row  items-center justify-evenly">
            <div
              className={`${mono.className} font-semibold hover:opacity-50 hover:cursor-pointer`}
            >
              Cancel
            </div>
            <div
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
