"use client";
import "../globals.css";
import { Space_Mono } from "next/font/google";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

export default function Home() {
  const jwtToken = Cookies.get("access_token");
  const [User, setUser] = useState<any>({});
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [NickName, setNickName] = useState("");
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState("");
  const [ProfilePicture, setProfilePicture] = useState();
  const FileInput = useRef();

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

  const HandleSubmit = async (event: any) => {
    event.preventDefault();

    const Data = {
      Firstname: FirstName,
      LastName: LastName,
      Login: NickName,
      avatar: ProfilePicture,
    };
    try {
      if (!Data.avatar) setError("Click the picture to select a file.");
      else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/updatecredentials`,
          {
            data: {
              ...Data,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0D0149] via-[#1b0297] to-[#0D0149] min-w-[100vw] h-[100vh]  flex  items-center p-[5%] overflow-scroll flex-col">
      <motion.form
        className="w-[80vw]  h-[70vh] min-h-[600px] max-w-[600px] bg-[#ccc4f7] rounded-xl flex justify-evenly items-center text-[#0D0149] flex-col  my-auto p-[3%]"
        onSubmit={HandleSubmit}
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <h1
          className={`${mono.className} text-[#0D0149] text-center m-[8px] font-semibold text-[18px] mt-[25px]`}
        >
          Do want to update your data ?
        </h1>
        <label
          className=" m-[8px] w-full h-[190px] flex items-center justify-center flex-col"
          htmlFor="avatar"
        >
          {" "}
          <div className="flex justify-center items-center w-[165px] h-[165px]">
            <Image
              src={User.avatar || "/ProfileUser.png"}
              width={160}
              height={160}
              alt="Profile Pic"
              className="rounded-full hover:opacity-40 hover:cursor-pointer hover:w-[155px] hover:h-[155px] border-[#0D0149] border-dashed border-4 m-[2px]"
              priority
            />
          </div>
          {error && (
            <p className={`${mono.className} text-rose-700 text-sm`}>{error}</p>
          )}
          {uploaded && (
            <p className={`${mono.className} text-[#0D0149] text-sm`}>
              {uploaded}
            </p>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            ref={FileInput}
            className="hidden"
            onChange={(e: any) => {
              setProfilePicture(e.target.files[0]);
              setUploaded("Done!");
              setError("");
            }}
          />
        </label>
        <div className=" w-[80%] h-[40%] flex flex-col justify-between m-[8px]">
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              name="firstname"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6`}
              placeholder="First Name"
              required
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              name="lastname"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6`}
              placeholder="Last Name"
              required
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              name="login"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6`}
              placeholder="Nickname"
              required
              value={NickName}
              onChange={(e) => setNickName(e.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          className={`text-[18px] font-semibold  bg-white px-[15px] py-[3px] rounded-xl hover:bg-[#0D0149] hover:text-white ${mono.className} mt-[20px]`}
        >
          Submit
        </button>

        <button
          className={`text-[18px] font-semibold text-gray-950 hover:opacity-30 ${mono.className} m-[20px]`}
        >
          Skip
        </button>
      </motion.form>
    </div>
  );
}
