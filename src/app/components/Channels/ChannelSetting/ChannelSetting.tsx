import { useState } from "react";
import Avatar from "../../shared/Avatar/Avatar"
import style from "./ChannelSetting.module.css"

const data = {
    avatarSrc: "/images/avatar2.png",
    channelName: "Channel Name",
    role: "Member",
};


function TypeSetter ()
{
    const [selectedOption, setSelectedOption] = useState(''); // State to track selected option

    const handleSelection = (event : any)=>{
        setSelectedOption(event.target.value)
    }
    return (
        <div className={`${style.type_setter} `}>
            <label>New Channel type : </label>
            <select value={selectedOption} onChange={handleSelection} className={`${style.user_input_fields} ${style.type_setter_select}`}> 
                {/* disable the current type of the channel */}
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="protected">Protected</option>
            </select>
            {selectedOption === 'protected' && (
            <div >
              <label >New Channel Password:</label>
              <input className={style.user_input_fields} placeholder="New Password"/>
            </div>
          )}
        </div>
    )
}

export function ChannelSetting ()
{
    return (
        <div className={`${style.channel_setting} ${style.display_as_block}`}>
            <div >
                <Avatar avatarSrc={data.avatarSrc} avatarToRight={false} />
                <div >
                    <h2>{data.channelName}</h2>
                </div>
            </div>
            <TypeSetter/>
            <button>CONFIRM</button>
        </div>
    )
}