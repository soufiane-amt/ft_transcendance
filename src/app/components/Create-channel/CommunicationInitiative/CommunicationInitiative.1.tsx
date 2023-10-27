import style from './CommunicationInitiative.module.css';

export interface CommunicationInitiativeProps
{
    userData: {username : string, avatar : string},
}

export function CommunicationInitiative({ userData }: CommunicationInitiativeProps) {
    return (
        <div className={style.communication_initiative}>
            <div className={style.communication_initiative__user}>
                <img className={style.communication_initiative__user__avatar} src={userData.avatar} alt="avatar" />
                {/* <Avatar src={userData.avatar} avatarToRight={false} /> */}
                <span className={style.communication_initiative__user__name}>{userData.username}</span>
            </div>
            <div className={style.communication_initiative__message}>
                <button>
                    <img className={style.communication_initiative__message_icon} src='../../../images/icons/CreateChannel/hello.png' alt="send hello icon" />
                </button>
            </div>
        </div>
    );
}
