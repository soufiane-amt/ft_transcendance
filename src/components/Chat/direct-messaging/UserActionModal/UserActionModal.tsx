"use client";
import style from "../../../../styles/ChatStyles/UserActionModal.module.css";
import Avatar from "../../shared/Avatar/Avatar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DiscussionDto } from "../../interfaces/DiscussionPanel";
import { findUserContacts } from "../../../../app/context/UsersContactBookContext";
import { useSessionUser } from "../../../../app/context/SessionUserContext";
import socket from "../../../../app/socket/socket";
import {
  findBannedRoomContext,
  useBanContext,
} from "../../../../app/context/BanContext";
import { useOutsideClick } from "../../../../CustomHooks/useOutsideClick";
import ChannelActionModal from "../../Channels/ChannelActionModal/ChannelActionModal";
import { ChannelSetting } from "../../Channels/ChannelSetting/ChannelSetting";
import { ChannelData } from "../../interfaces/ChannelData";





type buttonType = { title: string; icon: string; backgroundColor: string };

const playButton = {
  title: "Play",
  icon: "/chatIcons/icons/play.png",
  backgroundColor: "#14C201",
};

const banButton = {
  title: "Ban",
  icon: "/chatIcons/icons/ban.png",
  backgroundColor: "red",
};
const unBanButton = {
  title: "UnBan",
  icon: "/chatIcons/icons/unban.png",
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
        {
          (!userIsBanned || userIsBanned.blocker_id === userSession.id) && 
          <ActionButton
            targetId={targetedUserId}
            buttonData={
              userIsBanned != null && userIsBanned.blocker_id === userSession.id
                ? unBanButton
                : banButton
            }
          />

        }
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



export type ChUserActionModalMainProps = {
  DiscussionToActId: string;
  channel_data :ChannelData | undefined;
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
  else if (props.ActionContext === "Channels" && 'channel_data' in props) {
    actionModal = (( 
      <div className={style.user_action_main_modal}>
        <ChannelActionModal 
          selectedDiscussionId={props.DiscussionToActId}
          channelData={props.channel_data}
          handleVisibility={setAsVisible}
        />
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
