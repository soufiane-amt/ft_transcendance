import Avatar from "../../shared/Avatar/Avatar"
import style from "./ChannelSetting.module.css"

const data = {
    avatarSrc: "/images/avatar.png",
    channelName: "samajat",
    role: "Member",
};

function ChannelSetting ()
{
    return (
        <div>
            <div >
                <Avatar avatarSrc={data.avatarSrc} avatarToRight={false} />
                <div >
                    <h1>{data.channelName}</h1>
                </div>
            </div>

        </div>
    )
}