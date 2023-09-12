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
function UserActionModal ({targetedUserData})
{
    const playButton = {title:"Play", icon:"/images/icons/play.png", backgroundColor:"#14C201"}
    const banButton = {title:"Ban", icon:"/images/icons/ban.png", backgroundColor:"red"}
    /*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */
    return (
        <div className={style.user_action_modal} onClick={(e)=>{ e.stopPropagation()}}>
            <div className={style.action_targeted_user}>
                <Avatar avatarSrc={`/images/${targetedUserData?.avatar}`} avatarToRight={false}/>
                <h1>{targetedUserData?.id}</h1>
            </div>
            <div className={style.interaction_buttons}> 
                <ActionButton buttonData={playButton}/>
                <ActionButton buttonData={banButton}/>
            </div>
        </div>
    )
}

/*This container does the same as UserActionModal execpt that it adds visibility managment*/
function UserActionModalMain({userData, modalState})
{  
    const [isVisible, setAsVisible] = modalState;

    const handleModalVisibility = () => {
        setAsVisible(false)
  }

    return (
      <div className={style.user_action_main_modal} onClick={handleModalVisibility} style={!isVisible? { display:"none"} : null}>
        <UserActionModal targetedUserData={userData}/>
      </div>
      )
  }

export default UserActionModalMain;