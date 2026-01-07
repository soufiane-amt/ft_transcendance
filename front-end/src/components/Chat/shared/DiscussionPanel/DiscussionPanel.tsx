"use client";

import React, { useState } from "react";
import style from "../../../../styles/ChatStyles/DiscussionPanel.module.css";
import {
  DiscussionDto,
  discussionPanelSelectType,
} from "../../interfaces/DiscussionPanel";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";
import {
  UserContactDataDto,
  useFindUserContacts,
} from "../../../../app/context/UsersContactBookContext";
import socket from "../../../../app/socket/socket";
import clsx from "clsx";
import {
  ChannelBookDto,
  useFindChannelBook,
} from "../../../../app/context/ChannelInfoBook";
import {
  UserContactDto,
  useSessionUser,
} from "../../../../app/context/SessionUserContext";
import UserActionModalMain from "../../direct-messaging/UserActionModal/UserActionModal";
import { ChannelData } from "../../interfaces/ChannelData";

const findDiscussions = (
  currentRoute: "Direct_messaging" | "Channels",
  partner_id: string | undefined,
  userContacts: UserContactDataDto | undefined,
  discussionData: ChannelBookDto | undefined,
  sessionUserData: UserContactDto
) => {
  if (currentRoute === "Direct_messaging") {
    if (partner_id !== undefined) {
      const discussion_data = userContacts;
      if (!discussion_data) return undefined;
      return {
        name: discussion_data.username,
        avatar: discussion_data.avatar,
      };
    } else {
      const discussion_data = sessionUserData;
      if (!discussion_data) return undefined;
      return {
        name: discussion_data.username,
        avatar: discussion_data.avatar,
      };
    }
  } else {
    const discussion_data = discussionData;
    if (!discussion_data) return undefined;
    return {
      name: discussion_data.name,
      avatar: discussion_data.avatar,
      type: discussion_data.type,
    };
  }
};

const badgeCount = (n: number) => {
  const unseenMassagesEdge: number = 99;
  return n > unseenMassagesEdge ? "99+" : n;
};

const formatLastMessage = (
  content: string | undefined,
  maxLength: number = 32
) => {
  if (!content) return "No messages yet";
  return content.length > maxLength
    ? content.substring(0, maxLength) + "..."
    : content;
};

interface PaneLastMessageProps {
  last_message_content: string | undefined;
  messageIsUnread: boolean;
}

function PaneLastMessage({
  last_message_content,
  messageIsUnread,
}: PaneLastMessageProps) {
  return (
    <p
      className={clsx(style.last_message, {
        [style.last_message_unread]: messageIsUnread,
      })}
    >
      {formatLastMessage(last_message_content)}
    </p>
  );
}

interface DiscussionPanelProps {
  onSelect: (panel: DiscussionDto) => void;
  DiscussionPanel: DiscussionDto;
  selectedDiscussion: discussionPanelSelectType;
  channelId: string;
  channelData: ChannelData | undefined;
  isSelected: boolean;
  showUserActionModal: () => void;
  currentRoute: "Direct_messaging" | "Channels";
}

function DiscussionPanel({
  onSelect,
  DiscussionPanel,
  selectedDiscussion,
  channelData,
  channelId,
  isSelected,
  currentRoute,
}: DiscussionPanelProps) {
  const [isHovered, setIsHovered] = useState(false);
  const sessionUser = useSessionUser();
  const channelBook = useFindChannelBook(DiscussionPanel.id);
  const sessionUserContacts = useFindUserContacts(DiscussionPanel.partner_id);
  const [modalIsVisible, setModalAsVisible] = useState<boolean>(false);

  const enableUnseenMessage = () =>
    !isSelected && DiscussionPanel.unread_messages !== 0;

  const handleDiscussionPanelClick = () => {
    onSelect(DiscussionPanel);
    socket.emit("MarkMsgRead", { _id: DiscussionPanel.id });
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(DiscussionPanel);
    setModalAsVisible(true);
  };

  const panel = findDiscussions(
    currentRoute,
    DiscussionPanel.partner_id,
    sessionUserContacts,
    channelBook,
    sessionUser
  );

  if (!panel) return null;

  return (
    <li
      className={clsx(style.panel, {
        [style.panel_selected]: isSelected,
        [style.panel_unread]: enableUnseenMessage(),
      })}
      onClick={handleDiscussionPanelClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection indicator */}
      {isSelected && <div className={style.selection_indicator}></div>}

      {/* Avatar section */}
      <div className={style.avatar_wrapper}>
        <Avatar
          src={panel.avatar}
          avatarToRight={false}
          channelType={panel.type}
        />
        {currentRoute === "Channels" && panel.type && (
          <span
            className={clsx(style.type_badge, {
              [style.type_public]: panel.type === "PUBLIC",
              [style.type_private]: panel.type === "PRIVATE",
              [style.type_protected]: panel.type === "PROTECTED",
            })}
          >
            {panel.type === "PRIVATE" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ) : panel.type === "PROTECTED" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
              </svg>
            )}
          </span>
        )}
      </div>

      {/* Content section */}
      <div className={style.content}>
        <div className={style.content_top}>
          <h3 className={style.name}>{panel.name}</h3>
          <div className={style.meta}>
            <TimeStamp time={DiscussionPanel.last_message?.createdAt} />
          </div>
        </div>
        <div className={style.content_bottom}>
          <PaneLastMessage
            last_message_content={DiscussionPanel.last_message?.content}
            messageIsUnread={DiscussionPanel.unread_messages > 0}
          />
          <div className={style.actions}>
            {enableUnseenMessage() && (
              <span className={style.unread_badge}>
                {badgeCount(DiscussionPanel.unread_messages)}
              </span>
            )}
            <button
              className={clsx(style.menu_button, {
                [style.menu_button_visible]: isHovered || isSelected,
              })}
              onClick={handleMenuClick}
              aria-label="More options"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="6" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="18" r="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={style.glow_effect}></div>
      {currentRoute === "Direct_messaging" && (
        <UserActionModalMain
          userToActId={selectedDiscussion.partner_id}
          DiscussionToActId={channelId}
          modalState={[modalIsVisible, setModalAsVisible]}
          ActionContext={currentRoute}
          channel_data={channelData}
        />
      )}
      {currentRoute === "Channels" && (
        <UserActionModalMain
          DiscussionToActId={channelId}
          channel_data={channelData}
          modalState={[modalIsVisible, setModalAsVisible]}
          ActionContext={currentRoute}
        />
      )}
    </li>
  );
}

export default DiscussionPanel;
