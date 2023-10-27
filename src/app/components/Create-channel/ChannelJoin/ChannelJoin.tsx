import style from './ChannelJoin.module.css';

export interface ChannelJoinProps
{
    channelData: {name : string, picture : string, type : string},
}

export function ChannelJoin({ channelData }: ChannelJoinProps) {
    return (
        <div className={style.channel_join}>
            <div className={style.channel_join__user}>
                <img className={style.channel_join__user__avatar} src={channelData.picture} alt="avatar" />
                <span className={style.channel_join__user__name}>{channelData.name}</span>
            </div>
            <div className={style.channel_join__message}>
                <button>
                    Join
                </button>
            </div>
        </div>
    );
}
