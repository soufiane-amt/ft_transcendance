import React, { useState } from "react";
import style from "./ConfirmationDialog.module.css";
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";



const getAppropriateMessage = (selectedType: string) => {
    switch (selectedType) {
      case 'UNBAN':
        return "Are you sure you want to unban this user before their ban time ends?";
      case 'UNMUTE':
        return "Are you sure you want to unmute this user before their mute time ends?";
      case 'KICK':
        return "Are you sure you want to kick this user out of the channel?";
      case 'PLAY':
          return "Are you sure you want to send a game invitation to this user?";
      case 'SETADMIN':
        return "Are you sure you want to set this user an administrator?";
      case 'SETUSER':
            return "Are you sure you want to lower this user grade to Member?";
          default:
        return "Unknown action";
    }
  };
  


interface ConfirmationDialogProps {
  handleButtonToggle: ()=> void,
  setShowConfirmationDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectType : string
}

export function ConfirmationDialog({handleButtonToggle, setShowConfirmationDialog, selectType }: ConfirmationDialogProps) {
    const ref = useOutsideClick(() => setShowConfirmationDialog(false));
  
    const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();//the modal reappears because of event propogation to the parent  
      setShowConfirmationDialog(false);
      handleButtonToggle()
    };
  
    const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();//the modal reappears because of event propogation to the parent  
      setShowConfirmationDialog(false);
    };
  
  
    return (
      <div ref={ref} data-inside-modal>
          <div className={style.confirmation_dialog} data-inside-modal>
            <h3> {getAppropriateMessage(selectType)}</h3>
            <div className={style.confirmation_buttons}>
              <button data-inside-modal onClick={handleConfirmClick}>Confirm</button>
              <button data-inside-modal onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
      </div>
    );
  }
  