import React, { ReactNode, useState } from "react";
import Avatar from "../../shared/Avatar/Avatar";
import style from "./UserModerationCard.module.css";
import { useSessionUser } from "../../../context/SessionUserContext";
import { RadioOptions } from "../../shared/RadioOptions/RadioOptions";

const data = {
  src: "/images/avatar.png",
  username: "samajat",
  role: "Member",
};

interface MemberType {
  src:string,
  username:string,
  role:string,

}
const button = {
  play: "/images/icons/Ch/play.png",
  ban: "/images/icons/Ch/ban.png",
  unban: "/images/icons/Ch/unban.png",
  mute: "/images/icons/Ch/mute.png",
  unmute: "/images/icons/Ch/unmute.png",
  kick: "/images/icons/Ch/kick.png",
};
enum ActionType {
  BAN,
  UNBAN,
  MUTE,
  UNMUTE,
  KICK,
  PLAY,
}

function getActionIcon(actionType: ActionType): string {
  if (actionType === ActionType.PLAY) return button.play;
  else if (actionType === ActionType.BAN) return button.ban;
  else if (actionType === ActionType.UNBAN) return button.unban;
  else if (actionType === ActionType.MUTE) return button.mute;
  else if (actionType === ActionType.UNMUTE) return button.unmute;
  return button.kick;
}
interface ModerationActionProps {
  actionType: ActionType;
}

function ModerationAction({ actionType }: ModerationActionProps) {
  const [showRadioOptions, setShowRadioOptions] = useState(false); // State to control the display of radio options
  const toggleRadioOptions = () => {
    setShowRadioOptions(!showRadioOptions); // Toggle the state when the button is clicked
  };


  const buttonSrc = getActionIcon(actionType);
  const handleClick = () => {
    switch (actionType) {
      case ActionType.BAN:
        toggleRadioOptions();
        // Handle ban action
        break;
      case ActionType.UNBAN:
        
        // Handle unban action
        break;
      case ActionType.MUTE:
        toggleRadioOptions();
        // Handle MUTE action
        break;
      case ActionType.UNMUTE:
        // Handle unMUTE action
        break;
      case ActionType.KICK:
        // Handle kick action
        break;
      case ActionType.PLAY:
        // Handle play action
        break;
      default:
        break;
    }
  };
  return (
    <button onClick={handleClick} className={style.moderation_action}>
      <img src={buttonSrc} alt={`Action: ${ActionType[actionType]}`} />
        {showRadioOptions && (
          <RadioOptions showOptionsState={{showRadioOptions, setShowRadioOptions}}selectType={`Moderate ${data.username}`} />
        )}
    </button>
  );
}




interface UserModerationCardProps {
  data:MemberType
}

// Helper function to determine if user is not the owner
function isNotOwner(data : MemberType) {
  return data.role !== 'Owner' ;
}

// Helper function to render moderation actions
function renderModerationActions(data : MemberType, currentUser:any) {
  const actions:ReactNode[] = [];
  if (currentUser.username === data.username)
    return actions
  if (isNotOwner(data)) {
    actions.push(<ModerationAction key="ban" actionType={ActionType.BAN} />);
    actions.push(<ModerationAction key="mute" actionType={ActionType.MUTE} />);
    actions.push(<ModerationAction key="kick" actionType={ActionType.KICK} />);
  }

  actions.push(<ModerationAction key="play" actionType={ActionType.PLAY} />);

  return actions;
}

export function UserModerationCard({ data }: UserModerationCardProps) {
  const currentUser = useSessionUser();

  return (
    <div className={style.moderation_card}>
      <div className={style.user_info}>
        <Avatar src={data.src} avatarToRight={false} />
        <div>
          <h3>{data.username}</h3>
          <h5>{data.role}</h5>
        </div>
      </div>
      <div className={style.action_buttons}>
        {renderModerationActions(data, currentUser)}
      </div>

    </div>
  );
}
