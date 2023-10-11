import React, { useEffect, useState } from "react";
import { Space_Mono } from "next/font/google";
import "../../styles/TailwindRef.css";
import Cookies from "js-cookie";
import newSocket from "../GlobalComponents/Socket/socket";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

function Invite({ ...props }) {
  //=========================================================================================================
  const [userFriend, setuserFriend] = useState<
    { id: number; username: string; avatar: string; status: string }[]
  >([]);
  const [updateFriend, setupdateFriend] = useState<
    { id: number; username: string; avatar: string; status: string }[]
  >([]);
  const [selectValue, setselectValue] = useState("all-user");
  const [searchQuery, setsearchQuery] = useState("");
  const JwtToken = Cookies.get("access_token");

  // const handleInputChange = (event: any) => {
  // setselectValue(event.target.value);
  // };

  useEffect(() => {
    if (searchQuery === "") {
      if (selectValue != "all-user") {
        const filterFriends = userFriend.filter((friend) =>
          friend.status.toLowerCase().includes(selectValue.toLowerCase())
        );
        setupdateFriend(filterFriends);
      } else setupdateFriend(userFriend);
    } else {
      const filterFriends = userFriend.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setupdateFriend(filterFriends);
    }
  }, [searchQuery, selectValue, userFriend]);

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
        <div className="flex items-center w-full flex-row-reverse h-[3%]">
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
        <input
          className={`w-[80%] h-[50px] bg-[#8c8c8c] rounded-3xl hover:cursor-text border-none pl-8 text-white text-[15px] placeholder:text-white ${mono.className} outline-none`}
          placeholder="Find Friend"
        ></input>
        <div className="w-[80%] bg-black text-white m-[5px]">
          {updateFriend.map((friend) => (
            <h1>{friend.username}, {friend.status}</h1>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Invite;
