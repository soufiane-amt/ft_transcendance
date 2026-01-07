"use client";

import { useEffect } from "react";
import style from "../../../../styles/ChatStyles/EmptyMode.module.css";
import socket from "../../../../app/socket/socket";
import { discussionPanelSelectType } from "../../interfaces/DiscussionPanel";
import { useHandleJoinDm } from "../../../../CustomHooks/useHandleJoinChannel";

interface EmptyDiscussionModeProps {
  selectedDiscussion: discussionPanelSelectType;
  currentRoute: "Direct_messaging" | "Channels";
  setDiscussionIsEmpty: React.Dispatch<React.SetStateAction<boolean>>;
}

function EmptyDiscussionMode({
  selectedDiscussion,
  currentRoute,
  setDiscussionIsEmpty,
}: EmptyDiscussionModeProps) {
  useHandleJoinDm(selectedDiscussion);

  useEffect(() => {
    const handleShowBar = () => {
      setDiscussionIsEmpty(false);
    };
    socket.on("newMessage", handleShowBar);
    return () => {
      socket.off("newMessage", handleShowBar);
    };
  }, [selectedDiscussion, setDiscussionIsEmpty]);

  const isChannels = currentRoute === "Channels";

  const navigateToCreateChannel = () => {
    window.location.href = "/chat/CreateChannel";
  };

  const navigateToMainChat = () => {
    window.location.href = "/chat/";
  };

  return (
    <div className={style.empty_container}>
      {/* Decorative background elements */}
      <div className={style.bg_circle_1}></div>
      <div className={style.bg_circle_2}></div>

      <div className={style.empty_content}>
        {/* Animated icon */}
        <div className={style.icon_wrapper}>
          <svg
            className={style.chat_icon}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 4C16.536 4 4 14.536 4 28c0 6.5 2.8 12.4 7.4 16.8L8 56l14.4-7.2c3 1 6.2 1.6 9.6 1.6 15.464 0 28-10.536 28-24S47.464 4 32 4z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="20"
              cy="28"
              r="3"
              fill="currentColor"
              className={style.dot_1}
            />
            <circle
              cx="32"
              cy="28"
              r="3"
              fill="currentColor"
              className={style.dot_2}
            />
            <circle
              cx="44"
              cy="28"
              r="3"
              fill="currentColor"
              className={style.dot_3}
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className={style.empty_title}>
          {isChannels ? "No Channels Yet" : "No Conversations"}
        </h2>

        {/* Description */}
        <p className={style.empty_description}>
          {isChannels
            ? "You're not a member of any channel yet. Create your own or join an existing one to start chatting with others."
            : "Your inbox is empty. Start a conversation with a friend to see your messages here."}
        </p>

        {/* Action buttons */}
        <div className={style.button_group}>
          {isChannels && (
            <button
              className={`${style.action_button} ${style.primary_button}`}
              onClick={navigateToCreateChannel}
            >
              <svg
                className={style.button_icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Channel
            </button>
          )}
          <button
            className={`${style.action_button} ${
              isChannels ? style.secondary_button : style.primary_button
            }`}
            onClick={navigateToMainChat}
          >
            <svg
              className={style.button_icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {isChannels ? "Browse Channels" : "Start Chatting"}
          </button>
        </div>

        {/* Helpful tip */}
        <div className={style.tip_container}>
          <span className={style.tip_icon}>💡</span>
          <span className={style.tip_text}>
            {isChannels
              ? "Tip: Channels are great for group discussions and team collaboration!"
              : "Tip: Click on a friend's profile to start a direct message."}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmptyDiscussionMode;
