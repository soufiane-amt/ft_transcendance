import style from './UserInitiativeTalk.module.css';
import helloIcon from '../../../../../public/images/icons/CreateChannel/hello.png';
import axios from 'axios';
import socket from '../../../socket/socket';
import { fetchDataFromApi } from '../../shared/customFetch/exmple';

export interface UserInitiativeTalkProps
{
    userData: {username : string, avatar : string},
}

export function UserInitiativeTalk({ userData }: UserInitiativeTalkProps) {
    const handleSendHello = async () => {
        try
        {
            const dm_id = await fetchDataFromApi(`/DirectMessaging/CreateDm?username=${userData.username}`)             
                .then(res => {
                  if (res.status === 200) {
                    socket.emit('broadacastJoinSignal', dm_id);
                    window.location.href = `/chat/Channels/`;
                  }
            })
        }
        catch(err)
        {
            window.location.reload();
            alert('Channel joining has failed!');
        }

        window.location.href = '/chat/DirectMessaging';
    }
    return (
        <div className={style.communication_initiative}>
            <div className={style.communication_initiative__user}>
                <img className={style.communication_initiative__user__avatar} src={userData.avatar} alt="avatar" />
                <span className={style.communication_initiative__user__name}>{userData.username}</span>
            </div>
            <div className={style.communication_initiative__message}>
                <button onClick={handleSendHello}>
                    <img className={style.communication_initiative__message_icon} src={helloIcon.src} alt="send hello icon" />
                </button>
            </div>
        </div>
    );
}
