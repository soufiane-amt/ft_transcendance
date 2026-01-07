"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import style from "../../../../styles/ChatStyles/ChannelActionModal.module.css";
import { ChannelData } from "../../interfaces/ChannelData";
import { useOutsideClick } from "../../../../CustomHooks/useOutsideClick";
import { useSessionUser } from "../../../../app/context/SessionUserContext";
import { useFindChannelBook } from "@/app/context/ChannelInfoBook";
import { useFindBannedRoomContext } from "../../../../app/context/BanContext";
import { RadioOptions } from "../../shared/RadioOptions/RadioOptions";
import { ConfirmationDialog } from "../../shared/ConfirmationDialog/ConfirmationDialog";
import { useUserContacts } from "@/app/context/UsersContactBookContext";
import socket from "../../../../app/socket/socket";
import newSocket from "@/components/GlobalComponents/Socket/socket";
import { ChannelSetting } from "../ChannelSetting/ChannelSetting";

// Debug: Log socket status on module load
console.log("[ChannelActionModal] Socket imported:", socket);
console.log("[ChannelActionModal] Socket connected:", socket?.connected);
console.log("[ChannelActionModal] Socket id:", socket?.id);

// Action types enum
enum ActionType {
  BAN,
  UNBAN,
  MUTE,
  UNMUTE,
  KICK,
  PLAY,
  SETADMIN,
  SETUSER,
  PROFILE,
}

// Icons
const Icons = {
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  settings: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  leave: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  invite: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  lock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  chevron: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  chevronLeft: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  trash: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L9 9L1 7L5 15L3 23H21L19 15L23 7L15 9L12 1Z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  hashtag: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  play: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  ban: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  unban: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  mute: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  unmute: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  kick: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="18" y1="8" x2="23" y2="13" />
      <line x1="23" y1="8" x2="18" y2="13" />
    </svg>
  ),
  promote: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  demote: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="17" y1="11" x2="23" y2="11" />
    </svg>
  ),
  profile: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

// Get icon for action type
function getActionIcon(actionType: ActionType): React.ReactNode {
  switch (actionType) {
    case ActionType.PLAY:
      return Icons.play;
    case ActionType.BAN:
      return Icons.ban;
    case ActionType.UNBAN:
      return Icons.unban;
    case ActionType.MUTE:
      return Icons.mute;
    case ActionType.UNMUTE:
      return Icons.unmute;
    case ActionType.KICK:
      return Icons.kick;
    case ActionType.SETADMIN:
      return Icons.promote;
    case ActionType.SETUSER:
      return Icons.demote;
    case ActionType.PROFILE:
      return Icons.profile;
    default:
      return Icons.users;
  }
}

// Get variant for action type
function getActionVariant(
  actionType: ActionType
): "default" | "success" | "danger" | "primary" | "warning" {
  switch (actionType) {
    case ActionType.PLAY:
      return "success";
    case ActionType.BAN:
      return "danger";
    case ActionType.UNBAN:
      return "success";
    case ActionType.MUTE:
      return "warning";
    case ActionType.UNMUTE:
      return "success";
    case ActionType.KICK:
      return "danger";
    case ActionType.SETADMIN:
      return "primary";
    case ActionType.SETUSER:
      return "warning";
    case ActionType.PROFILE:
      return "primary";
    default:
      return "default";
  }
}

// Get action label
function getActionLabel(actionType: ActionType): string {
  switch (actionType) {
    case ActionType.PLAY:
      return "Invite to Game";
    case ActionType.BAN:
      return "Ban User";
    case ActionType.UNBAN:
      return "Unban User";
    case ActionType.MUTE:
      return "Mute User";
    case ActionType.UNMUTE:
      return "Unmute User";
    case ActionType.KICK:
      return "Kick User";
    case ActionType.SETADMIN:
      return "Promote to Admin";
    case ActionType.SETUSER:
      return "Demote to Member";
    case ActionType.PROFILE:
      return "View Profile";
    default:
      return "Action";
  }
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "success" | "danger" | "primary" | "warning";
  description?: string;
  disabled?: boolean;
}

function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
  description,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      className={`${style.action_button} ${style[`action_button_${variant}`]} ${
        disabled ? style.action_button_disabled : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={style.action_icon}>{icon}</div>
      <div className={style.action_text}>
        <span className={style.action_label}>{label}</span>
        {description && (
          <span className={style.action_description}>{description}</span>
        )}
      </div>
      <div className={style.action_chevron}>{Icons.chevron}</div>
    </button>
  );
}

// Member action button component with moderation logic
interface MemberActionButtonProps {
  actionType: ActionType;
  actionData: { userId: string; targeted_user: string; channel_id: string };
  onActionComplete?: () => void;
}

function MemberActionButton({
  actionType,
  actionData,
  onActionComplete,
}: MemberActionButtonProps) {
  const [showRadioOptions, setShowRadioOptions] = useState(false);
  const [currentActionType, setCurrentActionType] = useState(actionType);

  const icon = getActionIcon(currentActionType);
  const variant = getActionVariant(currentActionType);
  const label = getActionLabel(currentActionType);

  const getOppositeButton = (currentButton: ActionType): ActionType => {
    switch (currentButton) {
      case ActionType.BAN:
        return ActionType.UNBAN;
      case ActionType.UNBAN:
        return ActionType.BAN;
      case ActionType.MUTE:
        return ActionType.UNMUTE;
      case ActionType.UNMUTE:
        return ActionType.MUTE;
      case ActionType.SETADMIN:
        return ActionType.SETUSER;
      case ActionType.SETUSER:
        return ActionType.SETADMIN;
      default:
        return currentButton;
    }
  };

  const handleButtonToggle = () => {
    const oppositeButton = getOppositeButton(currentActionType);
    setCurrentActionType(oppositeButton);
  };

  const executeAction = () => {
    console.log(
      "[MemberActionButton] Executing action:",
      currentActionType,
      actionData
    );

    switch (currentActionType) {
      case ActionType.UNBAN:
        if (!actionData.targeted_user) {
          console.warn(
            "[MemberActionButton] UNBAN skipped - missing targeted_user",
            actionData
          );
          break;
        }
        console.debug("[MemberActionButton] emit channelUserUnBan", actionData);
        socket.emit("channelUserUnBan", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        handleButtonToggle();
        break;

      case ActionType.UNMUTE:
        if (!actionData.targeted_user) {
          console.warn(
            "[MemberActionButton] UNMUTE skipped - missing targeted_user",
            actionData
          );
          break;
        }
        console.debug(
          "[MemberActionButton] emit channelUserUnMute",
          actionData
        );
        socket.emit("channelUserUnMute", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        handleButtonToggle();
        break;

      case ActionType.KICK:
        if (!actionData.targeted_user) {
          console.warn(
            "[MemberActionButton] KICK skipped - missing targeted_user",
            actionData
          );
          break;
        }
        console.debug("[MemberActionButton] emit kickOutUser", actionData);
        socket.emit("kickOutUser", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        break;

      case ActionType.PLAY:
        console.log(
          "[MemberActionButton] emit invite_to_game_through_chat",
          actionData
        );
        const payload: any = {
          inviteeId: actionData.userId,
        };

        newSocket.emit("invite_to_game_through_chat", payload);
        break;

      case ActionType.SETADMIN:
        if (!actionData.targeted_user) {
          console.warn(
            "[MemberActionButton] SETADMIN skipped - missing targeted_user",
            actionData
          );
          break;
        }
        console.log(
          "[MemberActionButton] emit upgradeMemberToAdmin",
          actionData
        );
        socket.emit("upgradeMemberToAdmin", {
          targeted_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        handleButtonToggle();
        break;

      case ActionType.SETUSER:
        if (!actionData.targeted_user) {
          console.warn(
            "[MemberActionButton] SETUSER skipped - missing targeted_user",
            actionData
          );
          break;
        }
        console.debug("[MemberActionButton] emit setAdminToMember", actionData);
        socket.emit("setAdminToMember", {
          targeted_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        handleButtonToggle();
        break;

      case ActionType.PROFILE:
        window.location.href = `/profile?username=${actionData.targeted_user}`;
        break;

      default:
        break;
    }
    onActionComplete?.();
  };

  const handleOptionsClick = (selectedOption: number) => {
    switch (currentActionType) {
      case ActionType.BAN:
        if (!actionData.targeted_user) {
          console.warn(
            "[MemberActionButton] BAN skipped - missing targeted_user",
            actionData
          );
          break;
        }
        console.debug("[MemberActionButton] emit channelUserBan", {
          ...actionData,
          actionDuration: selectedOption,
        });
        socket.emit("channelUserBan", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
          actionDuration: selectedOption,
        });
        handleButtonToggle();
        break;
      case ActionType.MUTE:
        if (!actionData.targeted_user) {
          console.warn(
            "[MemberActionButton] MUTE skipped - missing targeted_user",
            actionData
          );
          break;
        }
        console.debug("[MemberActionButton] emit channelUserMute", {
          ...actionData,
          actionDuration: selectedOption,
        });
        socket.emit("channelUserMute", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
          actionDuration: selectedOption,
        });
        handleButtonToggle();
        break;
      default:
        break;
    }
    setShowRadioOptions(false);
    onActionComplete?.();
  };

  const handleClickButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only show RadioOptions for BAN/MUTE (need duration selection)
    if (
      currentActionType === ActionType.BAN ||
      currentActionType === ActionType.MUTE
    ) {
      setShowRadioOptions(true);
    } else {
      // Execute action directly for all other actions
      executeAction();
    }
  };

  return (
    <div className={style.member_action_wrapper}>
      <button
        className={`${style.member_action_btn} ${
          style[`member_action_${variant}`]
        }`}
        onClick={handleClickButton}
        title={label}
      >
        {icon}
      </button>

      {showRadioOptions && (
        <div
          className={style.action_popup}
          onClick={(e) => e.stopPropagation()}
        >
          <RadioOptions
            handleButtonToggle={(op) => {
              handleOptionsClick(op);
            }}
            setShowRadioOptions={setShowRadioOptions}
            selectType={`${ActionType[currentActionType]}`}
          />
        </div>
      )}
    </div>
  );
}

// Member card component
interface MemberType {
  userId: string;
  avatar: string;
  username: string;
  role: string;
  isBanned: boolean;
  isMuted: boolean;
}

interface MemberCardProps {
  member: MemberType;
  channelId: string;
  sessionUserId: string;
  sessionUserRole: "Owner" | "Admin" | "Member";
  isBannedInChannel: boolean;
}

function MemberCard({
  member,
  channelId,
  sessionUserId,
  sessionUserRole,
  isBannedInChannel,
}: MemberCardProps) {
  const isCurrentUser = member.userId === sessionUserId;
  const isMemberOwner = member.role === "Owner";
  const isMemberAdmin = member.role === "Admin";

  console.log("sessionUserRole : ", sessionUserRole);
  console.log(
    "[MemberCard] Rendering member:",
    member.username,
    "Role:",
    member.role,
    "Banned:",
    member.isBanned,
    "Muted:",
    member.isMuted
  );
  const actionData = {
    userId: member.userId,
    targeted_user: member.username,
    channel_id: channelId,
  };

  // Render moderation actions based on permissions
  const renderActions = () => {
    const actions: React.ReactNode[] = [];

    // If it's the current user, show leave button
    if (isCurrentUser) {
      return (
        <button
          className={`${style.member_action_btn} ${style.member_action_danger}`}
          onClick={() => {
            console.debug("[MemberCard] emit leaveChannel", channelId);
            socket.emit("leaveChannel", channelId);
            window.location.reload();
          }}
          title="Leave Channel"
        >
          {Icons.leave}
        </button>
      );
    }

    // Always show profile and play buttons for other users
    actions.push(
      <MemberActionButton
        key={`${member.userId}-profile`}
        actionType={ActionType.PROFILE}
        actionData={actionData}
      />
    );

    actions.push(
      <MemberActionButton
        key={`${member.userId}-play`}
        actionType={ActionType.PLAY}
        actionData={actionData}
      />
    );

    // Moderation actions only for admins/owners and if not banned
    if (sessionUserRole !== "Member" && !isBannedInChannel) {
      // Owner can promote/demote
      if (sessionUserRole === "Owner") {
        if (isMemberAdmin) {
          actions.push(
            <MemberActionButton
              key={`${member.userId}-setuser`}
              actionType={ActionType.SETUSER}
              actionData={actionData}
            />
          );
        } else {
          actions.push(
            <MemberActionButton
              key={`${member.userId}-setadmin`}
              actionType={ActionType.SETADMIN}
              actionData={actionData}
            />
          );
        }
      }

      // Can't moderate owner
      if (!isMemberOwner) {
        // Ban/Unban
        if (member.isBanned) {
          actions.push(
            <MemberActionButton
              key={`${member.userId}-unban`}
              actionType={ActionType.UNBAN}
              actionData={actionData}
            />
          );
        } else if (!member.isMuted) {
          actions.push(
            <MemberActionButton
              key={`${member.userId}-ban`}
              actionType={ActionType.BAN}
              actionData={actionData}
            />
          );
        }

        // Mute/Unmute
        if (member.isMuted) {
          actions.push(
            <MemberActionButton
              key={`${member.userId}-unmute`}
              actionType={ActionType.UNMUTE}
              actionData={actionData}
            />
          );
        } else if (!member.isBanned) {
          actions.push(
            <MemberActionButton
              key={`${member.userId}-mute`}
              actionType={ActionType.MUTE}
              actionData={actionData}
            />
          );
        }

        // Kick
        actions.push(
          <MemberActionButton
            key={`${member.userId}-kick`}
            actionType={ActionType.KICK}
            actionData={actionData}
          />
        );
      }
    }

    return actions;
  };

  return (
    <div
      className={`${style.member_card} ${
        member.isBanned ? style.member_banned : ""
      } ${member.isMuted ? style.member_muted : ""}`}
    >
      <div className={style.member_info}>
        <div className={style.member_avatar_wrapper}>
          <img
            src={member.avatar || "https://www.gravatar.com/avatar/?d=mp"}
            alt={member.username}
            className={style.member_avatar}
          />
          {isMemberOwner && (
            <div className={`${style.member_role_badge} ${style.owner_badge}`}>
              {Icons.crown}
            </div>
          )}
          {isMemberAdmin && !isMemberOwner && (
            <div className={`${style.member_role_badge} ${style.admin_badge}`}>
              {Icons.star}
            </div>
          )}
        </div>
        <div className={style.member_details}>
          <span className={style.member_name}>
            {member.username}
            {isCurrentUser && <span className={style.you_badge}>You</span>}
            {member.isBanned && (
              <span className={style.status_badge_banned}>Banned</span>
            )}
            {member.isMuted && !member.isBanned && (
              <span className={style.status_badge_muted}>Muted</span>
            )}
          </span>
          <span className={style.member_role}>{member.role}</span>
        </div>
      </div>

      <div className={style.member_actions}>{renderActions()}</div>
    </div>
  );
}

// Members list view
interface MembersViewProps {
  channelData: ChannelData;
  channelId: string;
  sessionUserId: string;
  sessionUserRole: "Owner" | "Admin" | "Member";
  onBack: () => void;
}

function MembersView({
  channelData,
  channelId,
  sessionUserId,
  sessionUserRole,
  onBack,
}: MembersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const bannedRooms = useFindBannedRoomContext(channelId);
  const isBannedInChannel = bannedRooms != null;

  const userContacts = useUserContacts();
  // Transform channel users to MemberType
  const transformedMembers: any[] = channelData.channelUsers.map(
    (userId: string) => {
      const user = userContacts.get(userId);
      const isOwner = userId === channelData.channelOwner;
      console.log("[MembersView] Processing user:", userId, "channelData.channelAdmins:", channelData.channelAdmins);
      const isAdmin = channelData.channelAdmins.some(
        (adminId: string) => adminId === userId
      );
      const isBanned = channelData.channelBans?.some(
        (bannedId: string) => bannedId === userId
      );
      const isMuted = channelData.channelMutes?.some(
        (mutedId: string) => mutedId === userId
      );

      return {
        userId: userId,
        avatar: user?.avatar,
        username: user?.username,
        role: isOwner ? "Owner" : isAdmin ? "Admin" : "Member",
        isBanned: isBanned || false,
        isMuted: isMuted || false,
      };
    }
  );

  // Filter members based on search
  const filteredMembers = transformedMembers.filter(
    (member) =>
      member?.username &&
      member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: Owner first, then admins, then members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const roleOrder = { Owner: 0, Admin: 1, Member: 2 };
    return (
      roleOrder[a.role as keyof typeof roleOrder] -
      roleOrder[b.role as keyof typeof roleOrder]
    );
  });

  return (
    <div className={style.members_view}>
      {/* Header */}
      <div className={style.members_header}>
        <button className={style.back_button} onClick={onBack}>
          {Icons.chevronLeft}
        </button>
        <div className={style.members_title}>
          <h3>Channel Members</h3>
          <span className={style.members_count}>
            {channelData.channelUsers.length} members
          </span>
        </div>
      </div>

      {/* Search */}
      <div className={style.search_container}>
        <div className={style.search_icon}>{Icons.search}</div>
        <input
          type="text"
          className={style.search_input}
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Members list */}
      <div className={style.members_list}>
        {sortedMembers.length > 0 ? (
          sortedMembers.map((member) => (
            <MemberCard
              key={member.userId}
              member={member}
              channelId={channelId}
              sessionUserId={sessionUserId}
              sessionUserRole={sessionUserRole}
              isBannedInChannel={isBannedInChannel}
            />
          ))
        ) : (
          <div className={style.no_members}>
            <p>No members found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Owner transfer view
interface OwnerTransferViewProps {
  channelData: ChannelData;
  channelId: string;
  onBack: () => void;
  onTransferComplete: () => void;
}

function OwnerTransferView({
  channelData,
  channelId,
  onBack,
  onTransferComplete,
}: OwnerTransferViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const userContacts = useUserContacts();

  // Get all members except the current owner
  const eligibleMembers = channelData.channelUsers
    .filter((userId: string) => userId !== channelData.channelOwner)
    .map((userId: string) => {
      const user = userContacts.get(userId);
      const isAdmin = channelData.channelAdmins.some(
        (adminId: string) => adminId === userId
      );
      return {
        userId,
        username: user?.username || "Unknown",
        avatar: user?.avatar,
        isAdmin,
      };
    })
    .filter((member) =>
      member.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // Sort: admins first
    .sort((a, b) => (b.isAdmin ? 1 : 0) - (a.isAdmin ? 1 : 0));

  const selectedMember = eligibleMembers.find(
    (m) => m.userId === selectedUser
  );

  const handleTransferOwnership = () => {
    if (!selectedUser || !selectedMember) return;

    setIsTransferring(true);

    // First, set the new owner
    socket.emit("setOwner", {
      targeted_username: selectedMember.username,
      channel_id: channelId,
    });

    // Then leave the channel
    setTimeout(() => {
      socket.emit("leaveChannel", channelId);
      setIsTransferring(false);
      onTransferComplete();
    }, 500);
  };

  // If only the owner is in the channel, show delete message
  if (eligibleMembers.length === 0) {
    return (
      <div className={style.owner_transfer_view}>
        <div className={style.members_header}>
          <button className={style.back_button} onClick={onBack}>
            {Icons.chevronLeft}
          </button>
          <div className={style.members_title}>
            <h3>Leave Channel</h3>
            <span className={style.members_count}>No other members</span>
          </div>
        </div>

        <div className={style.empty_transfer_state}>
          <div className={style.empty_transfer_icon}>{Icons.trash}</div>
          <h4>You're the only member</h4>
          <p>
            Since you're the only member in this channel, leaving will permanently
            delete the channel and all its messages.
          </p>
          <div className={style.empty_transfer_actions}>
            <button className={style.cancel_btn} onClick={onBack}>
              Cancel
            </button>
            <button
              className={style.delete_channel_btn}
              onClick={() => {
                setIsTransferring(true);
                socket.emit("leaveChannel", channelId);
                setTimeout(() => {
                  onTransferComplete();
                }, 500);
              }}
              disabled={isTransferring}
            >
              {isTransferring ? (
                <div className={style.btn_spinner} />
              ) : (
                <>
                  {Icons.trash}
                  <span>Delete Channel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.owner_transfer_view}>
      {/* Header */}
      <div className={style.members_header}>
        <button className={style.back_button} onClick={onBack}>
          {Icons.chevronLeft}
        </button>
        <div className={style.members_title}>
          <h3>Transfer Ownership</h3>
          <span className={style.members_count}>
            Select the new owner before leaving
          </span>
        </div>
      </div>

      {/* Warning banner */}
      <div className={style.transfer_warning}>
        <div className={style.warning_icon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className={style.warning_content}>
          <span className={style.warning_title}>You must transfer ownership</span>
          <span className={style.warning_text}>
            As the channel owner, you need to select a new owner before you can
            leave.
          </span>
        </div>
      </div>

      {/* Search */}
      <div className={style.search_container}>
        <div className={style.search_icon}>{Icons.search}</div>
        <input
          type="text"
          className={style.search_input}
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Members list */}
      <div className={style.transfer_members_list}>
        {eligibleMembers.map((member) => (
          <div
            key={member.userId}
            className={`${style.transfer_member_card} ${
              selectedUser === member.userId ? style.transfer_member_selected : ""
            }`}
            onClick={() => setSelectedUser(member.userId)}
          >
            <div className={style.transfer_member_info}>
              <div className={style.transfer_avatar_wrapper}>
                <img
                  src={member.avatar || "https://www.gravatar.com/avatar/?d=mp"}
                  alt={member.username}
                  className={style.transfer_avatar}
                />
                {member.isAdmin && (
                  <div className={style.transfer_admin_badge}>
                    {Icons.star}
                  </div>
                )}
              </div>
              <div className={style.transfer_member_details}>
                <span className={style.transfer_member_name}>
                  {member.username}
                </span>
                <span className={style.transfer_member_role}>
                  {member.isAdmin ? "Admin" : "Member"}
                </span>
              </div>
            </div>
            <div className={style.transfer_checkbox}>
              {selectedUser === member.userId && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className={style.transfer_actions}>
        <button className={style.cancel_btn} onClick={onBack}>
          Cancel
        </button>
        <button
          className={style.transfer_btn}
          onClick={handleTransferOwnership}
          disabled={!selectedUser || isTransferring}
        >
          {isTransferring ? (
            <div className={style.btn_spinner} />
          ) : (
            <>
              <span>Transfer & Leave</span>
              {Icons.leave}
            </>
          )}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && selectedMember && (
        <ConfirmationDialog
          title="Transfer Ownership & Leave"
          message={
            <>
              Are you sure you want to transfer ownership to{" "}
              <strong>{selectedMember.username}</strong> and leave the channel?
              <br />
              <br />
              This action cannot be undone.
            </>
          }
          confirmLabel="Transfer & Leave"
          cancelLabel="Cancel"
          variant="warning"
          onConfirm={handleTransferOwnership}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isTransferring}
        />
      )}
    </div>
  );
}

interface ChannelActionModalProps {
  selectedDiscussionId: string;
  channelData: ChannelData | undefined;
  handleVisibility: (param: boolean) => void;
}

function ChannelActionModalContent({
  selectedDiscussionId,
  channelData,
  handleVisibility,
}: ChannelActionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<
    "main" | "members" | "settings" | "transfer"
  >("main");
  const sessionUser = useSessionUser();
  const ref = useOutsideClick(handleVisibility);
  const currentChannel = useFindChannelBook(selectedDiscussionId);

  if (!channelData) {
    return (
      <div ref={ref} className={style.modal_container}>
        <div className={style.modal_content}>
          <div className={style.error_state}>
            <div className={style.error_icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3>Channel Not Found</h3>
            <p>This channel may have been deleted or you don't have access.</p>
            <button
              className={style.error_button}
              onClick={() => handleVisibility(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = channelData.channelOwner === sessionUser.id;
  const isAdmin = channelData.channelAdmins.some(
    (adminId: string) => adminId === sessionUser.id
  );
  const sessionUserRole: "Owner" | "Admin" | "Member" = isOwner
    ? "Owner"
    : isAdmin
    ? "Admin"
    : "Member";

    console.log("isAdmin : ", isAdmin);
  const getChannelTypeIcon = () => {
    switch (currentChannel?.type) {
      case "PRIVATE":
        return Icons.lock;
      case "PROTECTED":
        return Icons.shield;
      default:
        return Icons.globe;
    }
  };

  const getChannelTypeLabel = () => {
    switch (currentChannel?.type) {
      case "PRIVATE":
        return "Private Channel";
      case "PROTECTED":
        return "Password Protected";
      default:
        return "Public Channel";
    }
  };

  const getChannelTypeClass = () => {
    switch (currentChannel?.type) {
      case "PRIVATE":
        return style.type_private;
      case "PROTECTED":
        return style.type_protected;
      default:
        return style.type_public;
    }
  };

  const handleLeaveChannel = () => {
    // If user is owner, show transfer ownership view
    if (isOwner) {
      setCurrentView("transfer");
      return;
    }

    // Otherwise, leave directly
    setIsLoading(true);
    console.debug(
      "[ChannelActionModal] emit leaveChannel",
      selectedDiscussionId
    );
    socket.emit("leaveChannel", selectedDiscussionId);
    setTimeout(() => {
      setIsLoading(false);
      handleVisibility(false);
      window.location.reload();
    }, 500);
  };

  const handleTransferComplete = () => {
    handleVisibility(false);
    window.location.reload();
  };

  const handleOpenSettings = () => {
    setCurrentView("settings");
  };

  const handleOpenMembers = () => {
    setCurrentView("members");
  };


  // Render transfer ownership view
  if (currentView === "transfer") {
    return (
      <div
        ref={ref}
        className={style.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.modal_content}>
          <button
            className={style.close_button}
            onClick={() => handleVisibility(false)}
            aria-label="Close modal"
          >
            {Icons.close}
          </button>

          <OwnerTransferView
            channelData={channelData}
            channelId={selectedDiscussionId}
            onBack={() => setCurrentView("main")}
            onTransferComplete={handleTransferComplete}
          />

          {isLoading && (
            <div className={style.loading_overlay}>
              <div className={style.loading_content}>
                <div className={style.loading_spinner} />
                <span className={style.loading_text}>Please wait...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render settings view
  if (currentView === "settings") {
    return (
      <div
        ref={ref}
        className={style.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.modal_content}>
          <button
            className={style.close_button}
            onClick={() => handleVisibility(false)}
            aria-label="Close modal"
          >
            {Icons.close}
          </button>

          <ChannelSetting
            channel_id={selectedDiscussionId}
            onBack={() => setCurrentView("main")}
            onClose={() => handleVisibility(false)}
          />

          {isLoading && (
            <div className={style.loading_overlay}>
              <div className={style.loading_content}>
                <div className={style.loading_spinner} />
                <span className={style.loading_text}>Please wait...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render members view
  if (currentView === "members") {
    return (
      <div
        ref={ref}
        className={style.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.modal_content}>
          <button
            className={style.close_button}
            onClick={() => handleVisibility(false)}
            aria-label="Close modal"
          >
            {Icons.close}
          </button>

          <MembersView
            channelData={channelData}
            channelId={selectedDiscussionId}
            sessionUserId={sessionUser.id}
            sessionUserRole={sessionUserRole}
            onBack={() => setCurrentView("main")}
          />

          {isLoading && (
            <div className={style.loading_overlay}>
              <div className={style.loading_content}>
                <div className={style.loading_spinner} />
                <span className={style.loading_text}>Please wait...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render main view
  return (
    <div
      ref={ref}
      className={style.modal_container}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={style.modal_content}>
        {/* Close button */}
        <button
          className={style.close_button}
          onClick={() => handleVisibility(false)}
          aria-label="Close modal"
        >
          {Icons.close}
        </button>

        {/* Decorative header gradient */}
        <div className={`${style.header_gradient} ${getChannelTypeClass()}`} />

        {/* Channel header */}
        <div className={style.channel_header}>
          <div className={style.avatar_container}>
            <div className={style.avatar_wrapper}>
              {currentChannel?.avatar ? (
                <img
                  src={currentChannel.avatar}
                  alt={currentChannel?.name}
                  className={style.avatar}
                />
              ) : (
                <div className={style.avatar_placeholder}>{Icons.hashtag}</div>
              )}
              <div className={`${style.type_badge} ${getChannelTypeClass()}`}>
                {getChannelTypeIcon()}
              </div>
            </div>
          </div>

          <div className={style.channel_info}>
            <h2 className={style.channel_name}>
              {currentChannel?.name || "Unknown Channel"}
            </h2>
            <div className={style.channel_meta}>
              <span
                className={`${style.channel_type_tag} ${getChannelTypeClass()}`}
              >
                {getChannelTypeIcon()}
                {getChannelTypeLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className={style.stats_container}>
          <div className={style.stat_card}>
            <div className={style.stat_icon}>{Icons.users}</div>
            <div className={style.stat_content}>
              <span className={style.stat_value}>
                {channelData.channelUsers?.length || 0}
              </span>
              <span className={style.stat_label}>Members</span>
            </div>
          </div>

          <div className={style.stat_card}>
            <div className={style.stat_icon}>{Icons.shield}</div>
            <div className={style.stat_content}>
              <span className={style.stat_value}>
                {(channelData.channelAdmins?.length || 0) +
                  (channelData.channelOwner ? 1 : 0)}
              </span>
              <span className={style.stat_label}>Admins</span>
            </div>
          </div>

          <div className={style.stat_card}>
            <div
              className={`${style.stat_icon} ${style.role_icon} ${
                isOwner
                  ? style.role_owner
                  : isAdmin
                  ? style.role_admin
                  : style.role_member
              }`}
            >
              {isOwner ? Icons.crown : isAdmin ? Icons.star : Icons.users}
            </div>
            <div className={style.stat_content}>
              <span
                className={`${style.role_badge} ${
                  isOwner
                    ? style.badge_owner
                    : isAdmin
                    ? style.badge_admin
                    : style.badge_member
                }`}
              >
                {sessionUserRole}
              </span>
              <span className={style.stat_label}>Your Role</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={style.actions_section}>
          <div className={style.section_header}>
            <span className={style.section_label}>Channel Actions</span>
            <div className={style.section_line} />
          </div>
          <div className={style.actions_list}>
            <ActionButton
              icon={Icons.users}
              label="View Members"
              description="See all channel members"
              onClick={handleOpenMembers}
              variant="primary"
            />

            {(isOwner || isAdmin) && (
              <ActionButton
                icon={Icons.settings}
                label="Channel Settings"
                description="Manage channel preferences"
                onClick={handleOpenSettings}
                variant="default"
              />
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className={style.actions_section}>
          <div className={style.section_header}>
            <span
              className={`${style.section_label} ${style.section_label_danger}`}
            >
              Danger Zone
            </span>
            <div
              className={`${style.section_line} ${style.section_line_danger}`}
            />
          </div>
          <div className={style.actions_list}>
            <ActionButton
              icon={Icons.leave}
              label="Leave Channel"
              description="You can rejoin anytime"
              onClick={handleLeaveChannel}
              variant="warning"
            />
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className={style.loading_overlay}>
            <div className={style.loading_content}>
              <div className={style.loading_spinner} />
              <span className={style.loading_text}>Please wait...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main wrapper component that uses Portal
function ChannelActionModal({
  selectedDiscussionId,
  channelData,
  handleVisibility,
}: ChannelActionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleVisibility(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleVisibility]);

  if (!mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleVisibility(false);
    }
  };

  const modalContent = (
    <div className={style.modal_backdrop} onClick={handleBackdropClick}>
      <div className={style.modal_wrapper}>
        <ChannelActionModalContent
          selectedDiscussionId={selectedDiscussionId}
          channelData={channelData}
          handleVisibility={handleVisibility}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ChannelActionModal;
