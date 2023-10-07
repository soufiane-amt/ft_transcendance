import { useState } from "react";
import Avatar from "../../shared/Avatar/Avatar";
import style from "./ChannelSetting.module.css";
import { findChannelnBook } from "../../../context/ChannelInfoBook";

const data = {
  src: "/images/avatar2.png",
  channelName: "Channel Name",
  type:'PUBLIC'
};


interface TypeSetterProps{
  currentType:string
}
function TypeSetter({currentType}:TypeSetterProps) {
  const [selectedOption, setSelectedOption] = useState(""); // State to track selected option

  const handleSelection = (event: any) => {
    setSelectedOption(event.target.value);
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
          <option disabled={currentType === "PRIVATE"} value="private">Private</option>
          <option disabled={currentType === "PUBLIC"} value="public">Public</option>
          <option disabled={currentType === "PROTECTED"} value="protected">Protected</option>
        </select>
      </div>
      {selectedOption === "protected" && (
        <div>
          <label>New Channel Password:</label>
          <input
            className={style.user_input_fields}
            placeholder="New Password"
            type="password"
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
  const currentChannel = findChannelnBook(channel_id)
  console.log ("||||>", currentChannel, channel_id)
  return (
      currentChannel && (
        <div className={`${style.channel_setting} ${style.display_as_block}`}>
          <div>
            <img className={style.channel_setting__img} src={currentChannel.avatar} />
            <div>
              <h2>{currentChannel.name}</h2>
            </div>
          </div>
          <TypeSetter currentType={currentChannel.type}/>
          <button>CONFIRM</button>
        </div>

      )
  );
}
