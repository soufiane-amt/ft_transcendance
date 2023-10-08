
import style from "./LeaveChannel.module.css";

export function LeaveChannel ()
{
    return (
        <div className={style.channel_quiting_section}>
            <h3>This section provide a way to quit the channel.</h3>
            <button>Leave Channel</button>
        </div>
    )
}