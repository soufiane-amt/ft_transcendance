"use client";
import "../globals.css";
import { Space_Mono } from "next/font/google";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

export default function Home() {
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
  }, []);

  return (
    <div className="bg-[#0D0149] min-w-[100vw] h-[100vh]  flex  items-center p-[5%] overflow-scroll flex-col">
      <form className="w-[80vw]  h-[70vh] min-h-[500px] max-w-[600px] bg-[#ccc4f7] rounded-xl flex justify-evenly items-center text-[#0D0149] flex-col  my-auto p-[3%]">
        <h1
          className={`${mono.className} text-[#0D0149] text-center m-[8px] font-semibold text-[18px]`}
        >
          Do want to update your data ?
        </h1>
        <label className=" m-[8px]">
          {" "}
          <Image
            src={User.avatar || "/ProfileUser.png"}
            width={170}
            height={170}
            alt="Profile Pic"
            className="rounded-full hover:opacity-40 hover:cursor-pointer"
            priority
          />
        </label>
        <div className=" w-[80%] h-[40%] flex flex-col justify-between m-[8px]">
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6`}
              placeholder="First Name"
            />
          </label>
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6`}
              placeholder="Last Name"
            />
          </label>
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6`}
              placeholder="Nickname"
            />
          </label>
        </div>
        <div
          className={`w-[80%] flex items-center justify-around m-[15px]  ${mono.className}`}
        >
          <button
            type="submit"
            className={`text-[18px] font-semibold text-gray-950 hover:opacity-30 `}
          >
            Skip
          </button>
          <button
            type="submit"
            className={`text-[18px] font-semibold  bg-white px-[15px] py-[3px] rounded-xl hover:bg-[#0D0149] hover:text-white`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
