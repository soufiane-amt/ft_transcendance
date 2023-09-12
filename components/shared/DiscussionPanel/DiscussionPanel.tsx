import style from './DiscussionPanel.module.css'
import Avatar from '../Avatar/Avatar';
import TimeStamp from '../TimeStamp/TimeStamp';
import { useState } from 'react';
import UserActionModalMain from '../../direct-messaging/UserActionModal/UserActionModal';


const avatar = "/images/avatar.png";
const panelLastMsg:string = 'The behavior could be thought of as a minimum gutter, as if the gutter is bigger somehow (because of something like justify-content: space-between;) then the gap will only take effect if that space would end up smaller.'
// const panelLastMsg:string = 'The behavior could '


function PaneLastMessage ( {message})
{
    return (
        <p id="notifier" className={style.panel_last_message}>
            {message}
        </p>
    )
}
/*
discussion id
avatar
name
last message
status
*/

function DiscussionPanel ({onSelect, DiscussionPanel, isSelected, showUserActionModal})
{    
    const defaultPanelColors = {backgroundColor: 'var(--discussion_panel_back_color)', color:'var(--discussion_panel_element_color)'}
    const selectionPanelColors = {backgroundColor: 'var(--discussion_panel_selection_color)', color:'var(--discussion_panel_element_selection_color)'}
    const panelTheme = isSelected ? selectionPanelColors : defaultPanelColors;

    return (
    <li key={DiscussionPanel.id} className={style.discussion_panel} onClick={ () => onSelect(DiscussionPanel)} style={panelTheme}>

        <Avatar avatarSrc={`/images/${DiscussionPanel.avatar}`} avatarToRight={false}/>

        <div className={style.panel_central_part}>
            <h3>{DiscussionPanel.name}</h3>
            <PaneLastMessage message={DiscussionPanel.lastMessage}/>
        </div>
        <div className={style.panel_last_part}>
            <button style={panelTheme} onClick={showUserActionModal}>...</button>
            <TimeStamp time={"12:22pm"}/>
            {!isSelected ? (
              <div className={style.panel_message_notifier}>new</div>
            ) : null}
        </div>
    
    </li>
    )
}


export default DiscussionPanel;