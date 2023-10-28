import { SideBarItem } from "./SideBarItem/SideBarItem";
import style from './ChatLeftBar.module.css';
import channelsIcon from '../../../../public/images/icons/left-bar/channel-icon.png';
import dmIcon from '../../../../public/images/icons/left-bar/dm-icon.png';
import createChannelIcon from '../../../../public/images/icons/left-bar/chat-bubble-icon.png';
import chatSpaceIcon from '../../../../public/images/icons/left-bar/chat-space.png';



function  ChatSpace ()
{
    return (
        <div className={style.chat_space}>
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
    return (
            <div className={style.chat_left_bar__side_bar}>
                <div>
                    <ChatSpace/>
                </div>
                <div>
                    <SideBarItem props={{icon: createChannelIcon.src, name: 'Channel'}}/>
                    <SideBarItem props={{icon: channelsIcon.src, name: 'Create Channel'}}/>
                    <SideBarItem props={{icon: dmIcon.src, name: 'Direct Messaging'}}/>
                </div>
            </div>
    )
}
