import { UserModerationCard } from "../UserModerationCard/UserModerationCard"
import style from "./ModerationToolBox.module.css"


export function ModerationToolBox ()
{
    return (
        <div className={style.moderation_tool_box}>
            <h2>Channel Members</h2>
            <div className={style.users_cards}>
                <UserModerationCard/>
                <UserModerationCard/>
                <UserModerationCard/>
                <UserModerationCard/>
                <UserModerationCard/>
                <UserModerationCard/>
                <UserModerationCard/>
                <UserModerationCard/>
                <UserModerationCard/>
            </div>
            <div className={style.user_addition}>
                <input placeholder="Enter a username"></input>
                <button>Add User</button>
            </div>
        </div>
    )
}