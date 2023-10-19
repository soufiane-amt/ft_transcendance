import React, { useContext, useEffect, useState } from "react";
import { Space_Mono } from "next/font/google";
import "../../styles/TailwindRef.css";
import Cookies from "js-cookie";
import newSocket from "../GlobalComponents/Socket/socket";
import { Press_Start_2P } from "next/font/google";
import GameContext from "./GameContext";


const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

function Invite({ ...props }) {
  //=========================================================================================================
  const [userFriend, setuserFriend] = useState<
    { id: number; username: string; avatar: string; status: string }[]
  >([]);
  const [updateFriend, setupdateFriend] = useState<
    { id: number; username: string; avatar: string; status: string }[]
  >([]);
  const [searchQuery, setsearchQuery] = useState("");
  const JwtToken = Cookies.get("access_token");
  const context: any = useContext(GameContext);


  //--------------------------------------
  useEffect(() => {
    if (searchQuery === "") {
      setupdateFriend(userFriend);
    } else {
      const filterFriends = userFriend.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setupdateFriend(filterFriends);
    }
  }, [searchQuery, userFriend]);

  useEffect(() => {
    fetch("http://localhost:3001/api/Dashboard/friends", {
      method: "Get",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setuserFriend(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [JwtToken, userFriend]);

  useEffect(() => {
    newSocket.on("online", (userObj) => {
      if (userObj) {
        setupdateFriend(userObj);
      }
    });

    newSocket.on("offline", (userObj) => {
      if (userObj) {
        setupdateFriend(userObj);
      }
    });

    newSocket.on("friend", (friends) => {
      try {
        console.log("Received friend event with data:", friends);
        if (friends) {
          setuserFriend(friends);
        }
      } catch (error) {
        console.error("Error handling friend event:", error);
      }
    });
  }, [JwtToken, updateFriend]);

  //=========================================================================================================

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2]">
      {/* this is the backdrop (the background opacity) */}
      <div
        className="absolute bg-black w-full h-full opacity-50 z-[2]"
        onClick={(ev) => {
          ev.preventDefault();
          props.setInvite(false);
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
              props.setInvite(false);
            }}
          />
        </div>
        <h2
          className={`text-[#0D0149] text-center font-bold text-[15px] md:text-[20px] ${pixelfont.className} mb-[18px]`}
        >
          Invite your friend!
        </h2>
        <div className="text-white  w-full flex  items-center flex-col">
          <input
            className={`w-[calc(100%-30px)] h-[50px] bg-[#0D0149] rounded-3xl hover:cursor-text border-none  text-white text-[15px] placeholder:text-white ${mono.className} outline-none  min-w-[220px] pl-[30px]`}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
          />
        </div>
        <div className="text-white my-[5px] w-full flex  items-center flex-col">
          {updateFriend
            .filter((friend) => friend.status === "ONLINE")
            .map((friend) => (
              <div
                key={friend.id}
                className={`w-full h-[50px] bg-[#0D0149] m-[10px] rounded-3xl flex justify-around items-center ${mono.className} min-w-[250px]`}
              >
                <img
                  src={friend.avatar}
                  alt="userpic"
                  className="w-[40px] h-[40px] rounded-full"
                />
                {friend.username}

                <div
                  onClick={(ev) => {
                    ev.preventDefault();
                    context.setGameSettings({...context.GameSettings, Oponent: friend.id})
                    props.setInvite(false);
                    props.setSettings(true);
                  }}
                  className={`w-[80px] h-[25px]  text-center flex items-center justify-center text-[#22EAAC]  border-[1px] border-[#22EAAC] border-solid ${mono.className} hover:opacity-[65%] hover:cursor-pointer rounded-md text-[13px]`}
                >
                  Invite
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Invite;
