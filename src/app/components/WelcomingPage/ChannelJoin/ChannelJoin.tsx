import { useState } from 'react';
import { ChannelPasswordInput } from '../ChannelPasswordInput/ChannelPasswordInput';
import style from './ChannelJoin.module.css';

export interface ChannelJoinProps
{
    channelData: {name : string, picture : string, type : string},
}

export function ChannelJoin({ channelData }: ChannelJoinProps) {
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const handleClickJoin = () => {
        if (channelData.type === 'PUBLIC') {
            // join channel
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
                <img className={style.channel_join__user__avatar} src={channelData.picture} alt="avatar" />
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
