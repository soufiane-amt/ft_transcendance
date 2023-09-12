import Image from "next/image"
import style from "./UserActionModal.module.css"
import Avatar from "../../shared/Avatar/Avatar"
import { useState } from "react"

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
            <img src={buttonData.icon} ></img>
            {buttonData.title}
        </button>
    )
}


const avatar = "/images/avatar.png"
function UserActionModal ()
{
    const playButton = {title:"Play", icon:"/images/icons/play.png", backgroundColor:"#14C201"}
    const banButton = {title:"Ban", icon:"/images/icons/ban.png", backgroundColor:"red"}
    return (
        <div className={style.user_action_modal} onClick={(e)=>{ e.stopPropagation()}}>
            <div className={style.action_targeted_user}>
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

/*This container does the same as UserActionModal execpt that it adds visibility managment*/
function UserActionModalMain()
{
    const [itemIsVisible, setVisible] = useState(true)
    const handleVisibility = () => {
      setVisible(false)
    }
    // <DirectMesgMain/>
    return (
      <div className={style.user_action_main_modal} onClick={handleVisibility}>
        {itemIsVisible && <UserActionModal />}
  
      </div>
      )
  }

export default UserActionModalMain;