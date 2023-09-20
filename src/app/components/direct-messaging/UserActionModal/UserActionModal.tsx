'use client'
import style from "./UserActionModal.module.css"
import Avatar from "../../shared/Avatar/Avatar"
import React, { useState } from "react"
import { DiscussionDto } from "../../../interfaces/DiscussionPanel"
import { findUserContacts } from "../../../context/UsersContactBookContext"


type buttonType =  {title :string, icon :string, backgroundColor:string}

const playButton = {title:"Play", icon:"/images/icons/play.png", backgroundColor:"#14C201"}

const banButton = {title:"Ban", icon:"/images/icons/ban.png", backgroundColor:"red"}


type ActionButtonProps =  {buttonData:buttonType}
function ActionButton({buttonData}:ActionButtonProps) /*button title, icon, backGroundColor */
{
    return (
        <button className={style.action_button} style={{backgroundColor:buttonData.backgroundColor}}>
            <img src={buttonData.icon} ></img>
            {buttonData.title}
        </button>
    )
}

function UserActionModal ({targetedUserId}:{targetedUserId : string})
{
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
                <ActionButton buttonData={playButton}/>
                <ActionButton buttonData={banButton}/>
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