import { useState } from 'react';
import { ChannelPasswordInput } from '../ChannelPasswordInput/ChannelPasswordInput';
import style from './ChannelJoin.module.css';
import socket from '../../../socket/socket';
import { ChannelType } from '../WelcomingPage';
import axios from 'axios';

export interface ChannelJoinProps
{
    channelData: ChannelType,
}

export function ChannelJoin({ channelData }: ChannelJoinProps) {
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const handleClickJoin = async () => {
        const channelRequestMembership = {
            channel_id : channelData.id,
            password: '',
            type: channelData.type
        }

        if (channelData.type === 'PUBLIC') {
            // join channel
            try
            {
                // join channel
                await axios.post('http://localhost:3001/chat/channelJoinRequest', 
                channelRequestMembership,
                { withCredentials: true
                  })
                    .then(res => {
                      if (res.status === 200) {
                        socket.emit('joinSignal', channelData.id);
                        window.location.href = `/chat/Channels/`;
                      }
                })
            }
            catch(err)
            {
                window.location.reload();
                alert('Channel joining has failed!');
            }
    
            //and redirect to channel
        }
        else {
            // show password input
            setShowPasswordInput(true);
        }
    }
    return (
        <>
            <div className={style.channel_join}>
                <div className={style.channel_join__user}>
                <img className={style.channel_join__user__avatar} src={channelData.image} alt="avatar" />
                <span className={style.channel_join__user__name}>{channelData.name}</span>
            </div>
            <div className={style.channel_join__message}>
                <button onClick={handleClickJoin}>
                    Join
                </button>
            </div>
            </div>
            {
                showPasswordInput &&
                <ChannelPasswordInput handleVisibility={()=>setShowPasswordInput(false)} channelData={channelData} />
            }
        </>
    );
}
