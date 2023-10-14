import React, { useState } from "react";
import style from "./LeaveChannel.module.css";
import CheckboxList from "../CheckBoxList/CheckBoxList";
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog";
import { findUserContacts } from "../../../context/UsersContactBookContext";

interface LeaveChannelProps {
  userGrade: 'Member' | 'Admin' | 'Owner',
  channelUsers: string[] | undefined,
}

export function LeaveChannel({ userGrade, channelUsers }: LeaveChannelProps) {
  const [showDropDownList, setShowDropDownList] = useState(false);

  const handleClickDropDown = () => {
    setShowDropDownList(!showDropDownList);
  };

  return (
    <div className={style.channel_quitting_section}>
      <h3>This section provides a way to leave the channel.</h3>
      <button onClick={handleClickDropDown}>Leave Channel</button>
      {userGrade === 'Owner' && (
        <>
            <h3>You can't leave the channel until you select your successor to be the channel Owner:</h3>
            <div >
             {showDropDownList && 
              <CheckboxList
                options={channelUsers
                  ?.map((user_id) => findUserContacts(user_id)?.username)
                  .filter(Boolean)} // Filter out any undefined usernames
              />
            }
          </div>
        </>
      )}
      {/* Add transfer and leave buttons */}
    </div>
  );
}
