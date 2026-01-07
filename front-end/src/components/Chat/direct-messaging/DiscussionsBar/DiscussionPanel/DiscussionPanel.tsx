"use client";
import style from "../../../../../styles/ChatStyles/DiscussionPanel.module.css";
import { DiscussionType } from "../DiscussionsBar";

interface DiscussionPanelProps {
  discussion: DiscussionType;
  isSelected: boolean;
  onSelect: () => void;
  isChannel: boolean;
}

export function DiscussionPanel({
  discussion,
  isSelected,
  onSelect,
  isChannel,
}: DiscussionPanelProps) {
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 35) => {
    if (!message) return "No messages yet";
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  return (
    <div
      className={`${style.panel} ${isSelected ? style.panel_selected : ""}`}
      onClick={onSelect}
    >
      {/* Avatar */}
      <div className={style.avatar_container}>
        <img
          src={discussion.image || "https://www.gravatar.com/avatar/?d=mp"}
          alt={discussion.name}
          className={style.avatar}
        />
        {!isChannel && discussion.isOnline && (
          <span className={style.online_indicator}></span>
        )}
        {isChannel && (
          <span className={style.channel_badge}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
            </svg>
          </span>
        )}
      </div>

      {/* Content */}
      <div className={style.content}>
        <div className={style.top_row}>
          <h3 className={style.name}>{discussion.name}</h3>
          {discussion.lastMessageTime && (
            <span className={style.time}>
              {formatTime(discussion.lastMessageTime)}
            </span>
          )}
        </div>
        <div className={style.bottom_row}>
          <p className={style.last_message}>
            {truncateMessage(discussion.lastMessage)}
          </p>
          {discussion.unreadCount && discussion.unreadCount > 0 && (
            <span className={style.unread_badge}>
              {discussion.unreadCount > 99 ? "99+" : discussion.unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && <div className={style.selection_indicator}></div>}
    </div>
  );
}
