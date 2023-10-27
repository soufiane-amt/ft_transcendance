import style from './ChannelPasswordInput.module.css';


interface ChannelPasswordInputProps{
    channelData: {name : string, picture : string},
}
export function ChannelPasswordInput ({channelData}: ChannelPasswordInputProps)
{

    return (
        <div className={style.channel_password_input}>
            <div className={style.channel_password_input__channel}>
                <img className={style.channel_password_input__avatar} src={channelData.picture} alt="avatar" />
                <span className={style.channel_password_input__name}>{channelData.name}</span>
            </div>
            <div className={style.channel_password__input_field}>
                <label >Enter Password:</label>
                <input type='password'  />
                <button>
                    Join
                </button>
            </div>
        </div>
    )
}