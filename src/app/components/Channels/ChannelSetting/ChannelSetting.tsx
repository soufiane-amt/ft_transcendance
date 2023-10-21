import React, { useState } from "react";
import Avatar from "../../shared/Avatar/Avatar";
import style from "./ChannelSetting.module.css";
import { findChannelBook } from "../../../context/ChannelInfoBook";
import socket from "../../../socket/socket";

const data = {
  src: "/images/avatar2.png",
  channelName: "Channel Name",
  type:'PUBLIC'
};


interface TypeSetterProps{
  selectedOptionState : {
    selectedOption : string | undefined,
    setSelectedOption : React.Dispatch<React.SetStateAction<string | undefined>>;
  }
  setNewPassword : React.Dispatch<React.SetStateAction<string>>;
}
function TypeSetter({selectedOptionState, setNewPassword}:TypeSetterProps) {

  const {selectedOption, setSelectedOption} = selectedOptionState;
  
  const handleSelection = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const handlePasswordTyping = (event: any) => {
    setNewPassword(event.target.value);
  };
  return (
    <div className={`${style.type_setter} `}>
      <div>
        <label>New Channel type : </label>
        <select
          value={selectedOption}
          onChange={handleSelection}
          className={`${style.user_input_fields} ${style.type_setter_select}`}
        >
          {/* disable the current type of the channel */}
          <option  value="PRIVATE">Private</option>
          <option  value="PUBLIC">Public</option>
          <option  value="PROTECTED">Protected</option>
        </select>
      </div>
      {selectedOption === "PROTECTED" && (
        <div>
          <label>New Channel Password:</label>
          <input
            className={style.user_input_fields}
            placeholder="New Password"
            type="password"
            onChange={handlePasswordTyping}
          />
        </div>
      )}
    </div>
  );
}


interface ChannelSettingProps{
  channel_id:string, 
}
export function ChannelSetting({channel_id}:ChannelSettingProps) {
  const currentChannel = findChannelBook(channel_id)
  const [selectedOption, setSelectedOption] = useState(currentChannel?.type); // State to track selected option
  const [settedPassword, setNewPassword] = useState(''); // State to track selected option


  const handleConfirmClick = () => {
    socket.emit("updateChannelType", {channel_id, type:selectedOption, password:settedPassword});
    window.location.reload();

  }
  return (
      currentChannel && (
        <div className={`${style.channel_setting} ${style.display_as_block}`}>
          <div>
            <img className={style.channel_setting__img} src={currentChannel.avatar} />
            <div>
              <h2>{currentChannel.name}</h2>
            </div>
          </div>
          <TypeSetter  selectedOptionState={{selectedOption, setSelectedOption}} setNewPassword={setNewPassword}/>
          <button onClick={handleConfirmClick}>CONFIRM</button>
        </div>

      )
  );
}
