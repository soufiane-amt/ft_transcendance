"use client";
import style from "./UserActionModal.module.css";
import Avatar from "../../shared/Avatar/Avatar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DiscussionDto } from "../../../interfaces/DiscussionPanel";
import { findUserContacts } from "../../../context/UsersContactBookContext";
import { useSessionUser } from "../../../context/SessionUserContext";
import socket from "../../../socket/socket";
import {
  findBannedRoomContext,
  useBanContext,
} from "../../../context/BanContext";
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";





type buttonType = { title: string; icon: string; backgroundColor: string };

const playButton = {
  title: "Play",
  icon: "/images/icons/play.png",
  backgroundColor: "#14C201",
};

const banButton = {
  title: "Ban",
  icon: "/images/icons/ban.png",
  backgroundColor: "red",
};
const unBanButton = {
  title: "UnBan",
  icon: "/images/icons/unban.png",
  backgroundColor: "red",
};

enum actionTypes {
  BAN = "BAN",
  UNBAN = "UNBAN",
}

type ActionButtonProps = { targetId: string; buttonData: buttonType };
function ActionButton({ targetId, buttonData }: ActionButtonProps) {
  const handleButtonClick = () => {
    switch (buttonData.title) {
      case "Ban":
        socket.emit("dmModeration", {
          targetedUserId: targetId,
          type: actionTypes.BAN,
        });
        break;
      case "UnBan":
        socket.emit("dmModeration", {
          targetedUserId: targetId,
          type: actionTypes.UNBAN,
        });
        break;
      default:
        return null;
    }
  };
  return (
    <button
      className={style.action_button}
      style={{ backgroundColor: buttonData.backgroundColor }}
      onClick={handleButtonClick}
    >
      <img src={buttonData.icon}></img>
      {buttonData.title}
    </button>
  );
}

function UserActionModal({
  handleVisibility,
  targetedUserId,
  targetedDiscussion,
}: {
  handleVisibility: (parm: boolean) => void;
  targetedUserId: string;
  targetedDiscussion: string;
}) {
  const userSession = useSessionUser();
  const userContact = findUserContacts(targetedUserId);
  const userIsBanned = findBannedRoomContext(targetedDiscussion);
  const ref = useOutsideClick(handleVisibility);

  if (!userContact) return <div>User action modal not found!</div>;

  return (
    <div
      ref={ref}
      className={style.user_action_modal}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={style.action_targeted_user}>
        <Avatar src={userContact.avatar} avatarToRight={false} />
        <h1>{userContact.username}</h1>
      </div>
      <div className={style.interaction_buttons}>
        <ActionButton targetId={targetedUserId} buttonData={playButton} />
        <ActionButton
          targetId={targetedUserId}
          buttonData={
            userIsBanned != null && userIsBanned.blocker_id === userSession.id
              ? unBanButton
              : banButton
          }
        />
      </div>
    </div>
  );
}




/*This container does the same as UserActionModal execpt that it adds visibility managment*/

type DmUserActionModalMainProps = {
  userToActId: string | undefined;
  DiscussionToActId: string;
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  ActionContext: string
};

type ChUserActionModalMainProps = {
  DiscussionToActId: string;
  channelOwner: string ;
  channelAdmins : string[];
  channelBans: string[];
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  ActionContext: string
};
type MyComponentProps = DmUserActionModalMainProps | ChUserActionModalMainProps;


function UserActionModalMain( props: MyComponentProps) {
  const [isVisible, setAsVisible] = props.modalState;
  var actionModal;
  if (props.ActionContext === "Direct_messaging" && 'userToActId' in props)
  {
    actionModal = (props.userToActId && <div className={style.user_action_main_modal}>
      <UserActionModal
        handleVisibility={setAsVisible}
        targetedUserId={props.userToActId}
        targetedDiscussion={props.DiscussionToActId}
      />
    </div>)
  }
  else if (props.ActionContext === "Channels") {
    actionModal = (( 
      <div className={style.user_action_main_modal}>
        channel options
      </div>
    ))
  }
  return (
    <>
      {isVisible && actionModal}
    </>
  );
}

export default UserActionModalMain;
