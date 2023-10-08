import React, { ReactNode, useState } from "react";
import Avatar from "../../shared/Avatar/Avatar";
import style from "./UserModerationCard.module.css";
import { useSessionUser } from "../../../context/SessionUserContext";
import { RadioOptions } from "../../shared/RadioOptions/RadioOptions";
import { ConfirmationDialog } from "../../shared/ConfirmationDialog/ConfirmationDialog";

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

function getOppositeButton (currentButton : ActionType) : ActionType
{
  if (currentButton === ActionType.PLAY) return (ActionType.PLAY);
  if (currentButton === ActionType.BAN) return (ActionType.UNBAN);
  else if (currentButton === ActionType.UNBAN)  return (ActionType.BAN);
  else if (currentButton === ActionType.MUTE) return (ActionType.UNMUTE);
  else return (ActionType.MUTE);

}
function ModerationAction({ actionType }: ModerationActionProps) {
  const [showRadioOptions, setShowRadioOptions] = useState(false); // State to control the display of radio options
  const [showConfirmation, setShowShowConfirmation] = useState(false); // State to control the display of radio options
  const [currentActionType, setCurrentActionType] = useState(actionType);

  const buttonSrc = getActionIcon(currentActionType);
  const handleClick = () => {
    switch (currentActionType) {
      case ActionType.BAN:
        setShowRadioOptions(true);
        // Handle ban action
        break;
      case ActionType.UNBAN:
        setShowShowConfirmation (true)
        
        // Handle unban action
        break;
      case ActionType.MUTE:
        setShowRadioOptions(true);
        // Handle MUTE action
        break;
      case ActionType.UNMUTE:
        setShowShowConfirmation (true)
        break;
      case ActionType.KICK:
        setShowShowConfirmation (true)

        // Handle kick action
        break;
      case ActionType.PLAY:
        setShowShowConfirmation (true)

        // Handle play action
        break;
      default:
        break;
    }
  };

  const handleButtonToggle = () => {
    // Toggle between buttons when Confirm is clicked
    const OppositeButton = getOppositeButton(currentActionType)
    setCurrentActionType (OppositeButton)
    setShowRadioOptions(false);
  };

  return (
    <button onClick={handleClick} className={style.moderation_action}>
      <img src={buttonSrc} alt={`Action: ${ActionType[currentActionType]}`} />
        {showRadioOptions && (
          <RadioOptions handleButtonToggle={handleButtonToggle} setShowRadioOptions={setShowRadioOptions} selectType={`${ActionType[currentActionType]}`} />
        )}
        { !showRadioOptions &&  showConfirmation && (
          <ConfirmationDialog handleButtonToggle={handleButtonToggle} setShowConfirmationDialog={setShowShowConfirmation}  selectType={`${ActionType[currentActionType]}`}></ConfirmationDialog>
        )}
    </button>
  );
}




interface UserModerationCardProps {
  data:MemberType
}

// Helper function to determine if user is not the owner
function isOwner(data : MemberType) {
  return data.role === 'Owner' ;
}

// Helper function to render moderation actions
function renderModerationActions(data : MemberType, currentUser:any, sessionUserIsModerator:boolean) {
  const actions:ReactNode[] = [];
  if (currentUser.username === data.username)
    return actions
  if (!isOwner(data) && sessionUserIsModerator) {
    actions.push(<ModerationAction key="ban" actionType={ActionType.BAN} />);
    actions.push(<ModerationAction key="mute" actionType={ActionType.MUTE} />);
    actions.push(<ModerationAction key="kick" actionType={ActionType.KICK} />);
  }

  actions.push(<ModerationAction key="play" actionType={ActionType.PLAY} />);

  return actions;
}
interface UserModerationCardProps {
  currentUserIsModerator : boolean,
  data : MemberType
}
export function UserModerationCard({ currentUserIsModerator, data }: UserModerationCardProps) {
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
        {renderModerationActions(data, currentUser, currentUserIsModerator)}
      </div>

    </div>
  );
}
