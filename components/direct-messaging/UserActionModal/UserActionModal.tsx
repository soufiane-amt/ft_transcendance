import Image from "next/image"
import style from "./UserActionModal.module.css"
import Avatar from "../../shared/Avatar/Avatar"

/*    user_id :string
    banner_id :string
    type : 'BAN' | "UNBAN"
    dm_id? : string
    channel_id? : string
    created_at? : Date
 */
function ActionButton({buttonData}) /*button title, icon, backGroundColor */
{
    return (
        <button className={style.action_button} style={{backgroundColor:buttonData.backgroundColor}}>
            <img src={buttonData.icon} style={{width:"32px"}}></img>
            {buttonData.title}
        </button>
    )
}
const avatar = "/images/avatar.png"
function UserActionModal ({playBanUser})
{
    const playButton = {title:"Play", icon:"/images/icons/play.png", backgroundColor:"#14C201"}
    const banButton = {title:"Ban", icon:"/images/icons/ban.png", backgroundColor:"red"}
    return (
        <div>
            <div className={style.action_targeted_user}>
                {/* <Image src={avatar} alt="targeted user image" width={50} height={50}></Image> */}
                <Avatar avatarSrc={avatar} avatarToRight={false}/>
                <h1>User_5432</h1>
            </div>
            <div className={style.interaction_buttons}> 
                <ActionButton buttonData={playButton}/>
                <ActionButton buttonData={banButton}/>
            </div>
        </div>
    )
}

export default UserActionModal;