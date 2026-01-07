"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "../../../../styles/ChatStyles/UserInitiativeTalk.module.css";
import socket from "../../../../app/socket/socket";
import { fetchDataFromApi } from "../../CustomFetch/fetchDataFromApi";

interface UserInitiativeTalkProps {
  userData: {
    username: string;
    avatar: string;
  };
}

export function UserInitiativeTalk({ userData }: UserInitiativeTalkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = async() => {
    try {
      await fetchDataFromApi(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/DirectMessaging/CreateDm/${userData.username}`
      ).then((res) => {
        if (res) {
          socket.emit("broadacastJoinSignal", {
            dm_id: res.dm_id,
            userToContact: res.userToContact,
          });
          router.push (`/chat/DirectMessaging`);
        }
      });
    } catch (err) {
      window.location.reload();
      alert("Private messaging joining has failed!");
    }
  };


  return (
    <div
      className={`${style.user_card} ${isHovered ? style.user_card_hover : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Avatar with online indicator */}
      <div className={style.avatar_container}>
        <img
          src={userData.avatar || "https://www.gravatar.com/avatar/?d=mp"}
          alt={userData.username}
          className={style.avatar}
        />
        <span className={style.online_indicator}></span>
      </div>

      {/* User info */}
      <div className={style.user_info}>
        <h3 className={style.username}>{userData.username}</h3>
        <p className={style.status}>Available to chat</p>
      </div>

      {/* Action button */}
      <button className={style.chat_button}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span>Message</span>
      </button>

      {/* Hover glow effect */}
      <div className={style.glow_effect}></div>
    </div>
  );
}
