'use client'
import style from "./UserActionModal.module.css"
import Avatar from "../../shared/Avatar/Avatar"
import React, { useState } from "react"
import { DiscussionDto } from "../../../interfaces/DiscussionPanel"
import { findUserContacts } from "../../../context/UsersContactBookContext"
import { useSessionUser } from "../../../context/SessionUserContext"
import socket from "../../../socket/socket"


type buttonType =  {title :string, icon :string, backgroundColor:string}

const playButton = {title:"Play", icon:"/images/icons/play.png", backgroundColor:"#14C201"}

const banButton = {title:"Ban", icon:"/images/icons/ban.png", backgroundColor:"red"}
const unBanButton = {title:"UnBan", icon:"/images/icons/unban.png", backgroundColor:"red"}

enum actionTypes{
    BAN = "BAN",
    UNBAN = "UNBAN",

}

type ActionButtonProps =  {targetId:string, buttonData:buttonType}
function ActionButton({targetId, buttonData}:ActionButtonProps) /*button title, icon, backGroundColor */
{
    const handleButtonClick =  ()=>{
        switch (buttonData.title)
        {
            case "Ban":
                socket.emit ("dmModeration", {targetedUserId: targetId, type:actionTypes.BAN});
            case "UnBan":
                socket.emit ("dmModeration", {targetedUserId: targetId, type:actionTypes.UNBAN})
            default :
                return null
        }
    }
    return (
        <button className={style.action_button} style={{backgroundColor:buttonData.backgroundColor}} onClick={handleButtonClick}>
            <img src={buttonData.icon} ></img>
            {buttonData.title}
        </button>
    )
}
function UserActionModal ({targetedUserId}:{targetedUserId:string})
{
    const currentUser = useSessionUser()
    const userContact = findUserContacts (targetedUserId)
    if (!userContact)
        return <div>User action modal not found!</div>
    return (
        <div className={style.user_action_modal} onClick={(e)=>{ e.stopPropagation()}}>
            <div className={style.action_targeted_user}>
                <Avatar avatarSrc={userContact.avatar} avatarToRight={false}/>
                <h1>{userContact.username}</h1>
            </div>
            <div className={style.interaction_buttons}> 
                <ActionButton targetId={targetedUserId} buttonData={playButton}/>
                <ActionButton targetId={targetedUserId} buttonData={banButton}/>
            </div>
        </div>
    )
}

/*This container does the same as UserActionModal execpt that it adds visibility managment*/

type UserActionModalMainProps = 
        {
            userToActId :string, 
            modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
        }

function UserActionModalMain({userToActId, modalState}: UserActionModalMainProps)
{  
    const [isVisible, setAsVisible] = modalState;

    const handleModalVisibility = () => {
        setAsVisible(false)
  }

    return (
      <div className={style.user_action_main_modal} onClick={handleModalVisibility} style={!isVisible? { display:"none"}:undefined }>
        <UserActionModal targetedUserId={userToActId}/>
      </div>
      )
  }

export default UserActionModalMain;