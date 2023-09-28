import React, { useEffect, useRef, useState } from 'react';
import style from './DiscussionPanel.module.css'; // Import styles
import { DiscussionDto } from '../../../interfaces/DiscussionPanel';
import Avatar from '../Avatar/Avatar';
import TimeStamp from '../TimeStamp/TimeStamp';
import { findUserContacts, useUserContacts } from '../../../context/UsersContactBookContext';
import socket from '../../../socket/socket';
import clsx from 'clsx';


const defaultPanelColors = {backgroundColor: 'var(--discussion_panel_back_color)', color:'var(--discussion_panel_element_color)'}
const selectionPanelColors = {backgroundColor: 'var(--discussion_panel_selection_color)', color:'var(--discussion_panel_element_selection_color)'}


const badgeCount = (n :number) =>
{
    const unseenMassagesEdge :number = 9;
    return (n > unseenMassagesEdge? unseenMassagesEdge+"+" : n)
}

function PaneLastMessage ( {last_message_content}:{last_message_content:string | undefined})
{
    return (
        <p className={style.panel_last_message}>
            {last_message_content}
        </p>
    )
}


interface DiscussionPanelProps {
    onSelect: (panel: DiscussionDto) => void;
    DiscussionPanel: DiscussionDto;
    isSelected: boolean;
    showUserActionModal: () => void;
  }
  

function DiscussionPanel ({onSelect, DiscussionPanel, isSelected, showUserActionModal} :DiscussionPanelProps)
{    

    // const panelTheme = isSelected ? selectionPanelColors : defaultPanelColors;
    const panelThemeClass = clsx({
        [style.discussion_panel_default_colors]:isSelected ===false,
        [style.discussion_panel_selection_colors]:isSelected ===true,
    });
    
    const enableUnseenMessage = () =>  (!isSelected  && DiscussionPanel.unread_messages != 0);
    const handleDiscussionPanelClick = () => {
        onSelect(DiscussionPanel);
        socket.emit ("MarkMsgRead", {_id:DiscussionPanel.id})
    }

    const panelOwner = findUserContacts(DiscussionPanel.partner_id)
    if (!panelOwner)
        return (<div>User panel doesn't exist</div>)
    
    return (
    <li key={DiscussionPanel.id} className={`${style.discussion_panel} ${panelThemeClass} `} onClick={handleDiscussionPanelClick}>

        <Avatar avatarSrc={panelOwner.avatar} avatarToRight={false}/>

        <div className={style.panel_central_part}>
            <h3>{panelOwner.username}</h3>
            <PaneLastMessage last_message_content={DiscussionPanel.last_message?.content}/>
        </div>
        <div className={style.panel_last_part}>
            <button className={panelThemeClass} onClick={showUserActionModal}>•••</button>
            <TimeStamp time={DiscussionPanel.last_message?.createdAt}/>
            {
                enableUnseenMessage() && (
              <div className={style.panel_message_notifier}>{badgeCount(DiscussionPanel.unread_messages)}</div>
            ) }
        </div>
    
    </li>
    )
}


export default DiscussionPanel;