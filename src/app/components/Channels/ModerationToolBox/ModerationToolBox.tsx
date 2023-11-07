import { useSessionUser } from "../../../context/SessionUserContext"
import { findUserContacts } from "../../../context/UsersContactBookContext"
import { ChannelData } from "../../../interfaces/ChannelData"
import { UserModerationCard } from "../UserModerationCard/UserModerationCard"
import style from "./ModerationToolBox.module.css"



export const getUserRole = (user_id:string, channelData:ChannelData | undefined) =>
{
    if ( channelData &&  channelData?.channelAdmins.includes(user_id))
        return "Admin"
    else if ( user_id === channelData?.channelOwner)
        return "Owner"
    else
        return "Member"
}

interface ModerationToolBoxProps{
    selectedChannel : string
    channelData: ChannelData|undefined, 
}    
export function ModerationToolBox ({selectedChannel, channelData}:ModerationToolBoxProps)
{
    const currentUser = useSessionUser()
    const currentUserIsModerator:string = getUserRole (currentUser.id, channelData) 

    return (
        <>
        {channelData && 
        <div className={style.moderation_tool_box}>
                <h2>Channel Members</h2>
                <div className={style.user_moderation_part}>

                    <div className={style.users_cards}>
                    {
                        channelData?.channelUsers.map((user)=>{
                            let userData;
                            if (user !==  currentUser.id)
                                userData = findUserContacts(user)
                            else
                                userData = {avatar:currentUser.avatar, username:currentUser.username}
                            const userRole = getUserRole (user, channelData)
                            const cardKey = `${user}`;
                            console.log('userData', userData)

                             return (userData &&
                                <UserModerationCard 
                                key={cardKey}
                                 selectedChannel={selectedChannel}
                                 currentUserIsModerator={currentUserIsModerator}
                                 targetedUser={{
                                 src:userData?.avatar,
                                 username:userData?.username,
                                 role:userRole,
                                 isBanned: channelData.channelBans.includes(user)===true,
                                 isMuted: channelData.channelMutes.includes(user)===true,
                             }}/> )
                        })

                    }
                    </div>
                    <div className={style.user_addition}>
                        {currentUserIsModerator !== 'Member' &&( 
                            <>
                                <input placeholder="Enter a username"></input>
                                <button>Add User</button>
                            </>
                        )}
                    </div>
                </div>
        </div>
        }
        </>
    )
}