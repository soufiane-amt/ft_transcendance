import style from './ChannelPasswordInput.module.css';
import { useOutsideClick } from '../../../../../hooks/useOutsideClick';
import { useState } from 'react';
import socket from '../../../socket/socket';
import { ChannelType } from '../WelcomingPage';
import { useRouter } from 'next/navigation';


interface ChannelPasswordInputProps{
    handleVisibility: (b : boolean) => void,
    channelData: ChannelType,
}
export function ChannelPasswordInput ({handleVisibility,  channelData}: ChannelPasswordInputProps)
{
    const router = useRouter();
    const [password, setPassword] = useState<string>('');
    const ref = useOutsideClick(handleVisibility);

    const handlePasswordChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleJoinClick = () => {
        // join channel
        socket.emit('joinSignal', { channel_id: channelData.id, channelType: channelData.type, password: password });
        
        //and redirect to channel
        window.location.href = `/chat/Channels/`;
        
    }
    return (
        <div   className={style.dark_background}>
            <div data-inside-modal ref={ref}  className={style.channel_password_input}>
                <div className={style.channel_password_input__channel} >
                    <img className={style.channel_password_input__avatar}  src={channelData.image} alt="avatar" />
                    <span className={style.channel_password_input__name} >{channelData.name}</span>
                </div>
                <div className={style.channel_password__input_field} >
                    <label >Enter Password:</label>
                    <input  type='password'  
                                placeholder='New password ...'
                                value={password}
                                onChange={handlePasswordChange}/>
                    <button onClick={handleJoinClick}>
                        Join
                    </button>
                </div>
            </div>
        </div>
    )
}