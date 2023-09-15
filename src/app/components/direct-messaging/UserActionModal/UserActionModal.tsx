'use client'
import style from "./UserActionModal.module.css"
import Avatar from "../../shared/Avatar/Avatar"
import React, { useState } from "react"
import { DiscussionDto } from "../../../interfaces/DiscussionPanel"


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

type UserActionModalProp = {targetedUserData : DiscussionDto}
function UserActionModal ({targetedUserData}:UserActionModalProp)
{
    /*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */
    return (
        <div className={style.user_action_modal} onClick={(e)=>{ e.stopPropagation()}}>
            <div className={style.action_targeted_user}>
                <Avatar avatarSrc={`/images/${targetedUserData?.avatar}`} avatarToRight={false}/>
                <h1>{targetedUserData?.username}</h1>
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
            userData :DiscussionDto, 
            modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
        }

function UserActionModalMain({userData, modalState}: UserActionModalMainProps)
{  
    const [isVisible, setAsVisible] = modalState;

    const handleModalVisibility = () => {
        setAsVisible(false)
  }

    return (
      <div className={style.user_action_main_modal} onClick={handleModalVisibility} style={!isVisible? { display:"none"}:undefined }>
        <UserActionModal targetedUserData={userData}/>
      </div>
      )
  }

export default UserActionModalMain;