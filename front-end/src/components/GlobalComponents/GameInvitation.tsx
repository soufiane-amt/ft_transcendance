"use client";
import React, { useEffect, useState } from "react";
import { Space_Mono } from "next/font/google";
import "../../styles/TailwindRef.css";
import { Press_Start_2P } from "next/font/google";
import Cookies from "js-cookie";
import axios from "axios";
import newSocket from "./Socket/socket";

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

const HandleSubmit = (data: any) => {
  const payload: any = {
    ...data,
    response: "accepted",
  };
  newSocket.emit("GameInvitationResponse", payload);
};

function GameInvitation({ ...props }) {
  const jwtToken = Cookies.get("access_token");
  const [Invitor, setInvitor]: any = useState({});
  const [Invitee, setInvitee]: any = useState({});

  useEffect(() => {
    async function getUserData(userdata: any, setter: any) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/game/user`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              user: userdata,
            },
          }
        );
        setter(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData(props.data.invitor_id, setInvitor);
    getUserData(props.data.invitee_id, setInvitee);
  }, [jwtToken, props.data]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[500]">
      {/* this is the backdrop (the background opacity) */}
      <div
        className="absolute bg-black w-full h-full opacity-50 z-[500]"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      ></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] flex flex-col   p-[30px] box-border overflow-y-scroll overflow-x-hidden items-center z-[600] min-h-[400px] min-w-[300px] max-h-[800px] max-w-[720px] text-[#0D0149] justify-between md:justify-evenly">
        <h2
          className={`text-[#0D0149] text-center font-bold text-[15px] md:text-[20px] ${pixelfont.className} min-h-[30px]`}
        >
          Game Request !
        </h2>
        <div className="w-full min-h-[370px] md:min-h-0 flex items-center justify-between md:justify-evenly flex-col md:flex-row mb-[20px] md:mb-0">
          <div className="flex flex-col justify-between w-[120px] h-[150px] items-center">
            <img
              src={Invitor.avatar || "/ProfileUser.png"}
              alt="Profile Pic"
              className=" card-shadow rounded-full w-[120px] h-[120px]"
            />
            <p
              className={`${mono.className} font-bold h-[15px] text-[#0D0149]`}
            >
              {Invitor.username}
            </p>
          </div>
          <p
            className={`${mono.className} text-center font-bold w-[15px] h-[15px] text-[#0D0149]`}
          >
            vs
          </p>
          <div className="flex flex-col justify-between w-[120px] h-[150px] items-center">
            <img
              src={Invitee.avatar || "/ProfileUser.png"}
              alt="Profile Pic"
              className=" card-shadow rounded-full w-[120px] h-[120px]"
            />
            <p
              className={`${mono.className} font-bold h-[15px] text-[#0D0149]`}
            >
              {Invitee.username}
            </p>
          </div>
        </div>
        <div
          className={`${mono.className} text-center font-bold min-h-[160px] md:min-h-0 flex items-center justify-center`}
        >
          <p className={`${mono.className} text-center font-bold`}>
            Ready for an epic Pong showdown? {Invitor.username} is challenging
            you to a pulse-pounding game you have only 20s to decide! Do you
            accept the challenge?
          </p>
        </div>
        <div className="min-h-[40px] md:min-h-0">
          <p className={`${mono.className} text-center font-bold text-red-600`}>
            {props.Timer} S
          </p>
        </div>
        <div className="min-h-[80px] flex  w-full flex-col md:flex-row  items-center justify-between md:justify-evenly md:min-h-0">
          <div
            onClick={(ev) => {
              ev.preventDefault();
              props.State(false);
              const payload: any = {
                ...props.data,
                response: "declined",
              };
              newSocket.emit("GameInvitationResponse", payload);
            }}
            className={`${mono.className} font-semibold hover:opacity-50 hover:cursor-pointer`}
          >
            Decline
          </div>
          <div
            onClick={(e) => {
              e.preventDefault();
              props.State(false);
              HandleSubmit(props.data);
            }}
            className={`text-[18px] text-white font-semibold  bg-[#0D0149] px-[15px] py-[3px] rounded-xl hover:opacity-50  ${mono.className}   border-none  hover:cursor-pointer`}
          >
            Accept
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameInvitation;
