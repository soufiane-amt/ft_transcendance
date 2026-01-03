"use client";

import React, { ReactNode, useState } from "react";
import Avatar from "../../shared/Avatar/Avatar";
import style from "../../../../styles/ChatStyles/UserModerationCard.module.css";
import { useSessionUser } from "../../../../app/context/SessionUserContext";
import { RadioOptions } from "../../shared/RadioOptions/RadioOptions";
import { ConfirmationDialog } from "../../shared/ConfirmationDialog/ConfirmationDialog";
import socket from "../../../../app/socket/socket";
import {
  Ban,
  useFindBannedRoomContext,
} from "../../../../app/context/BanContext";
import newSocket from "@/components/GlobalComponents/Socket/socket";

const data = {
  src: "/chatIcons/avatar.png",
  username: "samajat",
  role: "Member",
};

interface MemberType {
  userId: string;
  src: string;
  username: string;
  role: string;
  isBanned: boolean;
  isMuted: boolean;
}
const button = {
  play: "/chatIcons/icons/Ch/play.png",
  ban: "/chatIcons/icons/Ch/ban.png",
  unban: "/chatIcons/icons/Ch/unban.png",
  mute: "/chatIcons/icons/Ch/mute.png",
  unmute: "/chatIcons/icons/Ch/unmute.png",
  kick: "/chatIcons/icons/Ch/kick.png",
  setAdmin: "/chatIcons/icons/Ch/make-admin.png",
  setUser: "/chatIcons/icons/Ch/down-admin.png",
};
enum ActionType {
  BAN,
  UNBAN,
  MUTE,
  UNMUTE,
  KICK,
  PLAY,
  SETADMIN,
  SETUSER,
}

function getActionIcon(actionType: ActionType): string {
  if (actionType === ActionType.PLAY) return button.play;
  else if (actionType === ActionType.BAN) return button.ban;
  else if (actionType === ActionType.UNBAN) return button.unban;
  else if (actionType === ActionType.MUTE) return button.mute;
  else if (actionType === ActionType.UNMUTE) return button.unmute;
  else if (actionType === ActionType.SETADMIN) return button.setAdmin;
  else if (actionType === ActionType.SETUSER) return button.setUser;
  return button.kick;
}

function getOppositeButton(currentButton: ActionType): ActionType {
  if (currentButton === ActionType.PLAY) return ActionType.PLAY;
  else if (currentButton === ActionType.BAN) return ActionType.UNBAN;
  else if (currentButton === ActionType.UNBAN) return ActionType.BAN;
  else if (currentButton === ActionType.MUTE) return ActionType.UNMUTE;
  else if (currentButton === ActionType.SETADMIN) return ActionType.SETUSER;
  else if (currentButton === ActionType.SETUSER) return ActionType.SETADMIN;
  else return ActionType.MUTE;
}

interface ModerationActionProps {
  actionData: { userId: string; targeted_user: string; channel_id: string };
  actionType: ActionType;
}

function ModerationAction({ actionData, actionType }: ModerationActionProps) {
  const [showRadioOptions, setShowRadioOptions] = useState(false); // State to control the display of radio options
  const [showConfirmation, setShowShowConfirmation] = useState(false); // State to control the display of radio options
  const [currentActionType, setCurrentActionType] = useState(actionType);

  const buttonSrc = getActionIcon(currentActionType);

  const handleButtonToggle = () => {
    // Toggle between buttons when Confirm is clicked
    const OppositeButton = getOppositeButton(currentActionType);
    setCurrentActionType(OppositeButton);
  };

  const handleClickConfirmDialog = () => {
    switch (currentActionType) {
      case ActionType.UNBAN:
        socket.emit("channelUserUnBan", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        break;

      case ActionType.UNMUTE:
        socket.emit("channelUserUnMute", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        break;
      case ActionType.KICK:
        socket.emit("kickOutUser", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        break;

      case ActionType.PLAY:
        //To merge with game
        const payload: any = {
          inviteeId: actionData.userId,
        };
        newSocket.emit("invite_to_game_through_chat", payload);
        break;

      case ActionType.SETADMIN:
        socket.emit("upgradeMemberToAdmin", {
          targeted_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        break;

      case ActionType.SETUSER:
        socket.emit("setAdminToMember", {
          targeted_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
        });
        break;
      default:
        break;
    }
  };

  const handleOptionsClick = (selectedOption: number) => {
    switch (currentActionType) {
      case ActionType.BAN:
        socket.emit("channelUserBan", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
          actionDuration: selectedOption,
        });
        break;
      case ActionType.MUTE:
        socket.emit("channelUserMute", {
          target_username: actionData.targeted_user,
          channel_id: actionData.channel_id,
          actionDuration: selectedOption,
        });
        break;
      default:
        break;
    }
    handleButtonToggle();
  };

  const handleClickButton = () => {
    if (
      currentActionType === ActionType.BAN ||
      currentActionType === ActionType.MUTE
    )
      setShowRadioOptions(true);
    else setShowShowConfirmation(true);
  };

  return (
    <button onClick={handleClickButton} className={style.moderation_action}>
      <img src={buttonSrc} alt={`Action: ${ActionType[currentActionType]}`} />
      {showRadioOptions && (
        <RadioOptions
          handleButtonToggle={(op) => {
            handleOptionsClick(op);
          }}
          setShowRadioOptions={setShowRadioOptions}
          selectType={`${ActionType[currentActionType]}`}
        />
      )}
      {!showRadioOptions && showConfirmation && (
        <ConfirmationDialog
          onConfirm={handleClickConfirmDialog}
          onCancel={() => setShowShowConfirmation(false)} // Optional cancel handler
          selectType={`${ActionType[currentActionType]}`}
        />
      )}
    </button>
  );
}

interface UserModerationCardProps {
  targetedUser: MemberType;
}

// Helper function to determine if user is not the owner
function isOwner(targetedUser: MemberType) {
  return targetedUser.role === "Owner";
}

// Helper function to render moderation actions
function renderModerationActions(
  selectedChannel: string,
  targetedUser: MemberType,
  currentUser: any,
  sessionUserModeratType: string,
  bannedRooms: Ban | undefined
) {
  const actions: ReactNode[] = [];
  const actionData = {
    userId: targetedUser.userId,
    targeted_user: targetedUser.username,
    channel_id: selectedChannel,
  };
  const handleSendingLeavingSignal = () => {
    socket.emit("leaveChannel", actionData.channel_id);
    window.location.reload();
  };

  if (currentUser.username === targetedUser.username)
    return (
      <button
        className={style.moderation_action}
        onClick={handleSendingLeavingSignal}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12L1.21913 11.3753L0.719375 12L1.21913 12.6247L2 12ZM11 13C11.5523 13 12 12.5523 12 12C12 11.4477 11.5523 11 11 11V13ZM5.21913 6.3753L1.21913 11.3753L2.78087 12.6247L6.78087 7.6247L5.21913 6.3753ZM1.21913 12.6247L5.21913 17.6247L6.78087 16.3753L2.78087 11.3753L1.21913 12.6247ZM2 13H11V11H2V13Z"
            fill="#FF0000"
          />
          <path
            d="M10 8.13193V7.38851C10 5.77017 10 4.961 10.474 4.4015C10.9479 3.84201 11.7461 3.70899 13.3424 3.44293L15.0136 3.1644C18.2567 2.62388 19.8782 2.35363 20.9391 3.25232C22 4.15102 22 5.79493 22 9.08276V14.9172C22 18.2051 22 19.849 20.9391 20.7477C19.8782 21.6464 18.2567 21.3761 15.0136 20.8356L13.3424 20.5571C11.7461 20.291 10.9479 20.158 10.474 19.5985C10 19.039 10 18.2298 10 16.6115V16.066"
            stroke="#FF0000"
            stroke-width="2"
          />
        </svg>
      </button>
    );
  const userKey = `user_${targetedUser.username}_${selectedChannel}`;
  if (sessionUserModeratType !== "Member" && bannedRooms == null) {
    if (sessionUserModeratType === "Owner") {
      if (targetedUser.role === "Admin")
        actions.push(
          <ModerationAction
            key={userKey + "setUser"}
            actionData={actionData}
            actionType={ActionType.SETUSER}
          />
        );
      else if (targetedUser.role === "Member")
        actions.push(
          <ModerationAction
            key={userKey + "setAdmin"}
            actionData={actionData}
            actionType={ActionType.SETADMIN}
          />
        );
    }

    if (!isOwner(targetedUser)) {
      if (targetedUser.isBanned)
        actions.push(
          <ModerationAction
            key={userKey + "unban"}
            actionData={actionData}
            actionType={ActionType.UNBAN}
          />
        );
      else if (!targetedUser.isMuted)
        actions.push(
          <ModerationAction
            key={userKey + "ban"}
            actionData={actionData}
            actionType={ActionType.BAN}
          />
        );

      if (targetedUser.isMuted)
        actions.push(
          <ModerationAction
            key={userKey + "unmute"}
            actionData={actionData}
            actionType={ActionType.UNMUTE}
          />
        );
      else if (!targetedUser.isBanned)
        actions.push(
          <ModerationAction
            key={userKey + "mute"}
            actionData={actionData}
            actionType={ActionType.MUTE}
          />
        );
      actions.push(
        <ModerationAction
          key={userKey + "kick"}
          actionData={actionData}
          actionType={ActionType.KICK}
        />
      );
    }
  }

  actions.push(
    <ModerationAction
      key={userKey + "play"}
      actionData={actionData}
      actionType={ActionType.PLAY}
    />
  );

  return actions;
}

interface UserModerationCardProps {
  selectedChannel: string;
  currentUserIsModerator: string;
  targetedUser: MemberType;
}
export function UserModerationCard({
  selectedChannel,
  currentUserIsModerator,
  targetedUser,
}: UserModerationCardProps) {
  const currentUser = useSessionUser();
  const bannedRooms = useFindBannedRoomContext(selectedChannel);

  return (
    <div className={style.moderation_card}>
      <div className={style.user_info}>
        <Avatar src={targetedUser?.src} avatarToRight={false} />
        <div>
          <h4>{targetedUser.username}</h4>
          <h6>{targetedUser.role}</h6>
        </div>
      </div>
      <div className={style.action_buttons}>
        {renderModerationActions(
          selectedChannel,
          targetedUser,
          currentUser,
          currentUserIsModerator,
          bannedRooms
        )}
      </div>
    </div>
  );
}
