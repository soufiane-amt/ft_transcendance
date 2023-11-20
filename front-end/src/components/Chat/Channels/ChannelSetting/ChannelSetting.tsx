'use client'

import React, { useState } from "react";
import style from "../../../../styles/ChatStyles/ChannelSetting.module.css";
import { useFindChannelBook } from "../../../../app/context/ChannelInfoBook";
import socket from "../../../../app/socket/socket";

const MaxPasswordLength = 50;
const MinPasswordLength = 8;


interface TypeSetterProps{
  selectedOptionState : {
    selectedOption : string | undefined ,
    setSelectedOption : React.Dispatch<React.SetStateAction<string | undefined>>;
  }
  passwordState : {
    password : string,
    setNewPassword : React.Dispatch<React.SetStateAction<string>>;
  }
}
function TypeSetter({selectedOptionState, passwordState}:TypeSetterProps) {

  const {password, setNewPassword} = passwordState;
  const {selectedOption, setSelectedOption} = selectedOptionState;
  
  const handleSelection = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const handlePasswordChange = (e :React.ChangeEvent<HTMLInputElement>) => {
  const inputText = e.target.value;
  if ( inputText.length <= MaxPasswordLength &&
      inputText[inputText.length - 1] !== ' ') {
        setNewPassword(inputText);
  }
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
        <div >
          <label>New Channel Password:</label>
          
          <input
            className={style.user_input_fields}
            placeholder="New Password"
            type="password"
            onChange={handlePasswordChange}
            />
          {
          password && password.length < MinPasswordLength &&
            <h3 className={style.password_warning_message}>
              Your password must be at least {MinPasswordLength} characters long!
            </h3>
          
          }
        </div>
      )}
    </div>
  );
}


interface ChannelSettingProps{
  channel_id:string, 
}
export function ChannelSetting({channel_id}:ChannelSettingProps) {
  const currentChannel = useFindChannelBook(channel_id)
  const [selectedOption, setSelectedOption] = useState <string | undefined>('PROTECTED'); // State to track selected option
  const [password, setNewPassword] = useState(''); // State to track selected option


  const handleConfirmClick = () => {
    if (selectedOption === "PROTECTED" && password.length < MinPasswordLength) {
      alert(`Your password must be at least ${MinPasswordLength} characters long!`);
      return;
    }
    socket.emit("updateChannelType", {channel_id, type:selectedOption, password:password});
    window.location.reload();

  }
  return (
      currentChannel && (
        <div className={`${style.channel_setting} ${style.display_as_block}`}>
          <div>
            <img  className={style.channel_setting__img} 
                  src={currentChannel.avatar} 
                  alt="channel setting image"/>
            <div>
              <h2>{currentChannel.name}</h2>
            </div>
          </div>
          <TypeSetter  selectedOptionState={{selectedOption, setSelectedOption}} passwordState={{password, setNewPassword}}/>
          <button onClick={handleConfirmClick}>CONFIRM</button>
        </div>

      )
  );
}
