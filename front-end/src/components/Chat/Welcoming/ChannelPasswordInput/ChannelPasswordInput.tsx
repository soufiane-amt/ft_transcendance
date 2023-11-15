import style from '../../../../styles/ChatStyles/ChannelPasswordInput.module.css';
import { useOutsideClick } from '../../../../CustomHooks/useOutsideClick';
import { useState } from 'react';
import socket from '../../../../app/socket/socket';
import { ChannelType } from '../WelcomingPage';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from "js-cookie";


interface ChannelPasswordInputProps{
    handleVisibility: (b : boolean) => void,
    channelData: ChannelType,
}
export function ChannelPasswordInput ({handleVisibility,  channelData}: ChannelPasswordInputProps)
{
    const router = useRouter();
    const [password, setPassword] = useState<string>('');
    const [displayJoinFailure, setDisplayJoinFailure] = useState<boolean>(false);
    const ref = useOutsideClick(handleVisibility);
    const jwtToken =  Cookies.get("access_token");

    const handlePasswordChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleJoinClick =async () => {
        const channelRequestMembership = {
            channel_id : channelData.id,
            password: password,
            type: channelData.type
        }
        try
        {

            // join channel
            await axios.post('http://localhost:3001/chat/channelJoinRequest', 
            channelRequestMembership,
            { 
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json', // Adjust this if needed
                },
              })
                .then(res => {
                  if (res.status === 200) {
                    // Continue with the rest of your createChannel logic
                    socket.emit('joinSignal', channelData.id);
                    window.location.href = `/chat/Channels/`;
                  }
            })
        }
        catch(err)
        {
            setDisplayJoinFailure(true);
        }
            
        // socket.emit('joinSignal', { channel_id: channelData.id, channelType: channelData.type, password: password });
        
        //and redirect to channel
        // window.location.href = `/chat/Channels/`;
        
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
                    {displayJoinFailure && <span className={style.channel_password_input__join_failure}>Denied permission</span>}
                </div>
            </div>
        </div>
    )
}