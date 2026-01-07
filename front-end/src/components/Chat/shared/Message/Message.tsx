"use client";

import clsx from "clsx";
import style from "../../../../styles/ChatStyles/Message.module.css";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";
import { useUserContacts } from "../../../../app/context/UsersContactBookContext";
import { useSessionUser } from "../../../../app/context/SessionUserContext";
import { useState } from "react";

interface MessageBubbleProps {
  messageContent: string;
  isSent: boolean;
}

function MessageBubble({ messageContent, isSent }: MessageBubbleProps) {
  return (
    <div
      className={clsx(style.bubble, {
        [style.bubble_sent]: isSent,
        [style.bubble_received]: !isSent,
      })}
    >
      <p className={style.bubble_text}>{messageContent}</p>
    </div>
  );
}

interface MessageActionsProps {
  isVisible: boolean;
  isSent: boolean;
  onReply?: () => void;
  onReact?: () => void;
  onCopy?: () => void;
}

function MessageActions({
  isVisible,
  isSent,
  onReply,
  onReact,
  onCopy,
}: MessageActionsProps) {
  const handleCopy = () => {
    if (onCopy) onCopy();
  };

  return (
    <div
      className={clsx(style.actions, {
        [style.actions_visible]: isVisible,
        [style.actions_left]: isSent,
        [style.actions_right]: !isSent,
      })}
    >
      <button className={style.action_btn} onClick={handleCopy} title="Copy">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
    </div>
  );
}

interface MessageProps {
  messageData: messageDto;
  showAvatar?: boolean;
  isGrouped?: boolean;
}

function Message({
  messageData,
  showAvatar = true,
  isGrouped = false,
}: MessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const userContacts = useUserContacts();
  const messageSender = userContacts.get(messageData.user_id);
  const userSession = useSessionUser();

  const isSent: boolean = userSession.id === messageData.user_id;
  const currentUser = isSent ? userSession : messageSender;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageData.content);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (!currentUser) return null;

  return (
    <div
      className={clsx(style.message_wrapper, {
        [style.message_wrapper_sent]: isSent,
        [style.message_wrapper_received]: !isSent,
        [style.message_wrapper_grouped]: isGrouped,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div
        className={clsx(style.avatar_container, {
          [style.avatar_hidden]: isGrouped || !showAvatar,
        })}
      >
        {!isSent && <Avatar src={currentUser.avatar || "https://www.gravatar.com/avatar/?d=mp"} avatarToRight={false} />}
      </div>

      {/* Message content */}
      <div
        className={clsx(style.message_content, {
          [style.message_content_sent]: isSent,
          [style.message_content_received]: !isSent,
        })}
      >
        {/* Username - only show for received messages and not grouped */}
        {!isSent && !isGrouped && (
          <span className={style.username}>{currentUser.username}</span>
        )}

        {/* Bubble with actions */}
        <div className={style.bubble_wrapper}>
          <MessageActions
            isVisible={isHovered}
            isSent={isSent}
            onCopy={handleCopy}
          />
          <MessageBubble messageContent={messageData.content} isSent={isSent} />

          {/* Copied tooltip */}
          {showCopied && (
            <div className={style.copied_toast}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div
          className={clsx(style.timestamp, {
            [style.timestamp_sent]: isSent,
            [style.timestamp_received]: !isSent,
          })}
        >
          <TimeStamp time={messageData.createdAt} />
          {isSent && (
            <span className={style.status_icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
