import React, { useEffect, useRef, useState } from 'react';
import style from './DiscussionPanel.module.css'; // Import styles
import { DiscussionDto } from '../../../interfaces/DiscussionPanel';
import Avatar from '../Avatar/Avatar';
import TimeStamp from '../TimeStamp/TimeStamp';
import { findUserContacts, useUserContacts } from '../../../context/UsersContactBookContext';


const defaultPanelColors = {backgroundColor: 'var(--discussion_panel_back_color)', color:'var(--discussion_panel_element_color)'}
const selectionPanelColors = {backgroundColor: 'var(--discussion_panel_selection_color)', color:'var(--discussion_panel_element_selection_color)'}

interface DiscussionPanelProps {
    onSelect: (panel: DiscussionDto) => void;
    DiscussionPanel: DiscussionDto;
    isSelected: boolean;
    showUserActionModal: () => void;
  }
  
const badgeCount = (n :number)
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
    const handleDiscussionPanelClick = () =>{
        console.log("Discussion Panel>>", DiscussionPanel)
        onSelect(DiscussionPanel)
    }

    //I take a reference to the state of isSelected

    const enableUnseenMessage = ()=> {
        const last_message_timestamp = new Date(DiscussionPanel.last_message.createdAt).getTime();
        return (!isSelected &&  (last_message_timestamp > lastSeenTime))
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
              <div className={style.panel_message_notifier}>{DiscussionPanel.unread_messages}</div>
            ) }
        </div>
    
    </li>
    )
}


export default DiscussionPanel;