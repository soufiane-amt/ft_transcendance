
import { useState } from "react";
import style from "./LeaveChannel.module.css";

export function LeaveChannel ()
{
    const [showDropDownList, setShowDropDownList] = useState(false)

    const handleClickDropDown = (()=>{
        setShowDropDownList(!showDropDownList)
    })
    return (
        <div className={style.channel_quiting_section}>
            <h3>This section provide a way to quit the channel.</h3>
            <button onClick={handleClickDropDown}>Dropdown</button>
            
            <div >
             {showDropDownList && 
                <li>
                    <ul>user1</ul>
                    <ul>user1</ul>
                    <ul>user1</ul>
                </li>}
            </div>

            <button>Leave Channel</button> 
            {/* Add tranfer and leave button */}
        </div>
    )
}