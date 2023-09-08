import style from './DiscussionPanel.module.css'
import Avatar from '../Avatar/Avatar';
import TimeStamp from '../TimeStamp/TimeStamp';


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


function DiscussionPanel ()
{
    return (
    <div className={style.discussion_panel}>
        <Avatar messageOwnerAvatar={avatar} avatarToRight={false}/>
        <div className={style.panel_central_part}>
            <h3>User_5412</h3>
            <PaneLastMessage message={panelLastMsg}></PaneLastMessage>
        </div>
        <div className={style.panel_last_part}>
            <button>...</button>
            <TimeStamp time={"12:22pm"}/>
            <div className={style.panel_message_notifier}>new</div>
        </div>
    </div>
    )
}


export default DiscussionPanel;