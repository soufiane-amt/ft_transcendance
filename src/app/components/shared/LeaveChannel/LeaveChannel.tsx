
import { useState } from "react";
import style from "./LeaveChannel.module.css";
import CheckboxList from "../CheckBoxList/CheckBoxList";
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog";

interface LeaveChannelProps{
    channelUsers: string[] | undefined,
}
export function LeaveChannel ({channelUsers}:LeaveChannelProps)
{
    const [showDropDownList, setShowDropDownList] = useState(false)

    const handleClickDropDown = (()=>{
        setShowDropDownList(!showDropDownList)
    })
    return (
        <div className={style.channel_quiting_section}>
            <h3>This section provide a way to quit the channel.</h3>
            

            <button onClick={handleClickDropDown}>Leave Channel</button> 
            <div className={style.channel_quiting__drop_down_list}>
             {showDropDownList &&
                <>
                    <h3>You can't leave the channel until you select your successor to be channel Owner:</h3>
                    <CheckboxList options={channelUsers}/>
                </>
                }
            </div>
            {/* Add tranfer and leave button */}
        </div>
    )
}