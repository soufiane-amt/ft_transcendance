import style from './ChannelPasswordInput.module.css';
import { useOutsideClick } from '../../../../../hooks/useOutsideClick';


interface ChannelPasswordInputProps{
    handleVisibility: (b : boolean) => void,
    channelData: {name : string, picture : string},
}
export function ChannelPasswordInput ({handleVisibility,  channelData}: ChannelPasswordInputProps)
{
    const ref = useOutsideClick(handleVisibility);

    return (
        <div   className={style.dark_background}>
            <div data-inside-modal ref={ref}  className={style.channel_password_input}>
                <div className={style.channel_password_input__channel} >
                    <img className={style.channel_password_input__avatar}  src={channelData.picture} alt="avatar" />
                    <span className={style.channel_password_input__name} >{channelData.name}</span>
                </div>
                <div className={style.channel_password__input_field} >
                    <label >Enter Password:</label>
                    <input  type='password'  placeholder='New password ...'/>
                    <button   >
                        Join
                    </button>
                </div>
            </div>
        </div>
    )
}