import React, { useEffect, useRef, useState } from 'react';
import style from './DiscussionPanel.module.css'; // Import styles
import { DiscussionDto } from '../../../interfaces/DiscussionPanel';
import Avatar from '../Avatar/Avatar';
import TimeStamp from '../TimeStamp/TimeStamp';
import { findUserContacts, useUserContacts } from '../../../context/UsersContactBookContext';


const avatar = "/images/avatar.png";
const panelLastMsg:string = 'The behavior could be thought of as a minimum gutter, as if the gutter is bigger somehow (because of something like justify-content: space-between;) then the gap will only take effect if that space would end up smaller.'

interface DiscussionPanelProps {
    onSelect: (panel: DiscussionDto) => void;
    DiscussionPanel: DiscussionDto;
    isSelected: boolean;
    showUserActionModal: () => void;
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
    //styling toggles
    const defaultPanelColors = {backgroundColor: 'var(--discussion_panel_back_color)', color:'var(--discussion_panel_element_color)'}
    const selectionPanelColors = {backgroundColor: 'var(--discussion_panel_selection_color)', color:'var(--discussion_panel_element_selection_color)'}
    
    const panelTheme = isSelected ? selectionPanelColors : defaultPanelColors;
    
    const [lastSeenTime, setLastSeen] = useState <number>(0)

    const panelOwner = findUserContacts(DiscussionPanel.partner_id)
    if (!panelOwner)
        return (<div>User panel doesn't exist</div>)
    const handleDiscussionPanelClick = () =>{
        onSelect(DiscussionPanel)
    }

    //I take a reference to the state of isSelected
    const prevIsSelectedRef = useRef<boolean>(isSelected);

    useEffect(() => {
      // Check if isSelected changed from true to false
      if (prevIsSelectedRef.current === true && isSelected === false) {
        setLastSeen(Date.now());
      }
  
      // I update the ref with the current isSelected value for the next render
      prevIsSelectedRef.current = isSelected;
    }, [isSelected]);
  
    const enableUnseenMessage = ()=> {
        const last_message_timestamp = new Date(DiscussionPanel.last_message.timestamp).getTime();
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
              <div className={style.panel_message_notifier}>new</div>
            ) }
        </div>
    
    </li>
    )
}


export default DiscussionPanel;