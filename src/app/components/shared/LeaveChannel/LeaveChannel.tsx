import React, { useState } from "react";
import style from "./LeaveChannel.module.css";
import CheckboxList from "../CheckBoxList/CheckBoxList";
import { findUserContacts } from "../../../context/UsersContactBookContext";
import socket from "../../../socket/socket";

interface LeaveChannelProps {
  selectedDiscussion: string,
  userGrade: 'Member' | 'Admin' | 'Owner',
  channelUsers: string[] | undefined,
}

export function LeaveChannel({selectedDiscussion, userGrade, channelUsers }: LeaveChannelProps) {
  const [showDropDownList, setShowDropDownList] = useState(false);

  const handleSendingLeavingSignal = () => {
    socket.emit('leaveChannel', selectedDiscussion)
    window.location.reload()
  }

  const handleClickLeave = () => {
    if (userGrade === 'Owner')
      setShowDropDownList(!showDropDownList);
    else
      handleSendingLeavingSignal()  
} ;

  return (
    <div className={style.channel_quitting_section}>
      <h3>This section provides a way to leave the channel.</h3>
      <button onClick={handleClickLeave}>Leave Channel</button>
      {userGrade === 'Owner' && (
        <>
            <h3>You can't leave the channel until you select your successor to be the channel Owner:</h3>
            <div >
             {showDropDownList && 
              <CheckboxList
                selectedDiscussion={selectedDiscussion}
                confirmSelection={handleSendingLeavingSignal}
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
