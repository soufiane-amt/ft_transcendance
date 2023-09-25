import React, { useEffect, useRef, useState } from 'react';
import style from './DiscussionPanel.module.css'; // Import styles
import { DiscussionDto } from '../../../interfaces/DiscussionPanel';
import Avatar from '../Avatar/Avatar';
import TimeStamp from '../TimeStamp/TimeStamp';
import { findUserContacts, useUserContacts } from '../../../context/UsersContactBookContext';
import axios from 'axios';
import socket from '../../../socket/socket';


const defaultPanelColors = {backgroundColor: 'var(--discussion_panel_back_color)', color:'var(--discussion_panel_element_color)'}
const selectionPanelColors = {backgroundColor: 'var(--discussion_panel_selection_color)', color:'var(--discussion_panel_element_selection_color)'}

interface DiscussionPanelProps {
    onSelect: (panel: DiscussionDto) => void;
    DiscussionPanel: DiscussionDto;
    isSelected: boolean;
    showUserActionModal: () => void;
  }
  
const badgeCount = (n :number) =>
{
    const unseenMassagesEdge :number = 99;
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



function DiscussionPanel ({onSelect, DiscussionPanel, isSelected, showUserActionModal} :DiscussionPanelProps)
{    
    const [lastSeenTime, setLastSeen] = useState <number>(0)
    const prevIsSelectedRef = useRef<boolean>(isSelected);
    useEffect(() => {
      // Check if isSelected changed from true to false
      if (prevIsSelectedRef.current && !isSelected) {
            setLastSeen(Date.now());
      }
  
      // I update the ref with the current isSelected value for the next render
      prevIsSelectedRef.current = isSelected;
    }, [isSelected]);
  
    //styling toggles
    
    const panelTheme = isSelected ? selectionPanelColors : defaultPanelColors;
    

    const panelOwner = findUserContacts(DiscussionPanel.partner_id)
    if (!panelOwner)
        return (<div>User panel doesn't exist</div>)

        const handleDiscussionPanelClick = () => {
            onSelect(DiscussionPanel);
            socket.emit ("MarkMsgRead", {_id:DiscussionPanel.id})
            
            // const requestData = { _id: DiscussionPanel.id };
          
            // axios.put('http://localhost:3001/chat/messages/markAsRead', requestData, {
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //     withCredentials: true, // This ensures that cookies are sent with the request
            //   })
      
                };
          
    //I take a reference to the state of isSelected

    const enableUnseenMessage = ()=> {
        // const last_message_timestamp = new Date(DiscussionPanel.last_message.createdAt).getTime();
        return (!isSelected  && DiscussionPanel.unread_messages != 0)
    }

    return (
    <li key={DiscussionPanel.id} className={style.discussion_panel} onClick={handleDiscussionPanelClick} style={panelTheme}>

        <Avatar avatarSrc={panelOwner.avatar} avatarToRight={false}/>

        <div className={style.panel_central_part}>
            <h3>{panelOwner.username}</h3>
            <PaneLastMessage last_message_content={DiscussionPanel.last_message?.content}/>
        </div>
        <div className={style.panel_last_part}>
            <button style={panelTheme} onClick={showUserActionModal}>•••</button>
            <TimeStamp time={DiscussionPanel.last_message.createdAt}/>
            {
                enableUnseenMessage() && (
              <div className={style.panel_message_notifier}>{badgeCount(DiscussionPanel.unread_messages)}</div>
            ) }
        </div>
    
    </li>
    )
}


export default DiscussionPanel;