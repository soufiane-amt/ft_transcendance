'use client'

import style from '../../../../styles/ChatStyles/UserInitiativeTalk.module.css';
import helloIcon from '../../../../../public/chatIcons/icons/CreateChannel/hello.png';
import axios from 'axios';
import socket from '../../../../app/socket/socket';
import { fetchDataFromApi } from '../../CustomFetch/fetchDataFromApi';
import { useSessionUser } from '../../../../app/context/SessionUserContext';

export interface UserInitiativeTalkProps
{
    userData: {username : string, avatar : string},
}

export function UserInitiativeTalk({ userData }: UserInitiativeTalkProps) {
    const handleSendHello = async () => {
        try
        {
            await fetchDataFromApi(`http://localhost:3001/chat/DirectMessaging/CreateDm/${userData.username}`)             
                .then(res => {
                  if (res) {
                    socket.emit('broadacastJoinSignal', {dm_id : res.dm_id, userToContact:res.userToContact});
                    window.location.href = `/chat/DirectMessaging`;
                  }
            })
        }
        catch(err)
        {
            window.location.reload();
            alert('Private messaging joining has failed!');
        }

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
