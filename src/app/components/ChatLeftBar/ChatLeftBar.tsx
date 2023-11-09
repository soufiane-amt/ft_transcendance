'use client';

import SideBarItem from "./SideBarItem/SideBarItem";
import style from './ChatLeftBar.module.css';
import channelsIcon from '../../../../public/images/icons/left-bar/channel-icon.png';
import dmIcon from '../../../../public/images/icons/left-bar/dm-icon.png';
import createChannelIcon from '../../../../public/images/icons/left-bar/chat-bubble-icon.png';
import chatSpaceIcon from '../../../../public/images/icons/left-bar/chat-space.png';


interface ChatSpaceProps{
    handleNavigation: () => void,
}
function  ChatSpace ({handleNavigation}: ChatSpaceProps)
{
    return (
        <div className={style.chat_space} onClick={handleNavigation}>
            <div className={style.chat_space__icon}>
                <img src={chatSpaceIcon.src} alt="icon " />
            </div>
            <div className={style.chat_space__name}>
                Chat Space
            </div>
        </div>
    )
}


export function ChatLeftBar() {
    const navigateToCreateChannel = () => {
        window.location.href = '/chat/CreateChannel';
    }

    const navigateToChannels = () => {
        window.location.href = '/chat/Channels';
    }

    const navigateToDm = () => {
        window.location.href = '/chat/DirectMessaging';
    }

    const navigateToMainChat = () => {
        window.location.href = '/chat/';
    }
    return (
            <div className={style.chat_left_bar__side_bar}>
                <div>
                    <ChatSpace handleNavigation={navigateToMainChat}/>
                </div>
                <div>
                    <SideBarItem handleNavigation={navigateToCreateChannel} data={{icon: createChannelIcon.src, name: 'Create Channel'}}/>
                    <SideBarItem handleNavigation={navigateToChannels} data={{icon:channelsIcon.src , name: 'Channel'}}/>
                    <SideBarItem handleNavigation={navigateToDm} data={{icon: dmIcon.src, name: 'Direct Messaging'}}/>
                </div>
            </div>
    )
}
