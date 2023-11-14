import { useSessionUser } from "../../../../app/context/SessionUserContext"
import { useUserContacts } from "../../../../app/context/UsersContactBookContext"
import { ChannelData } from "../../interfaces/ChannelData"
import { UserModerationCard } from "../UserModerationCard/UserModerationCard"
import style from "../../../../styles/ChatStyles/ModerationToolBox.module.css"



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
    const userContacts = useUserContacts();
    const currentUserIsModerator:string = getUserRole (currentUser.id, channelData) 

    const sortedChannelUsers = channelData?.channelUsers.sort((a: string, b: string) => {
        // Compare user roles
        const roleOrder: { [key: string]: number } = {
            Owner: 1,
            Admin: 2,
            Member: 3,
        };

        // Compare user roles first
        const roleComparison = roleOrder[getUserRole(a, channelData)] - roleOrder[getUserRole(b, channelData)];

        // If roles are the same, compare usernames alphabetically
        if (roleComparison === 0) {
            const aUserData = userContacts.get(a);
            const bUserData = userContacts.get(b);
            if (aUserData && bUserData) {
                return aUserData.username.localeCompare(bUserData.username);
            }
        }

        return roleComparison;
    });
      
          return (
        <>
        {channelData && 
        <div className={style.moderation_tool_box}>
                <h2>Channel Members</h2>
                <div className={style.user_moderation_part}>

                    <div className={style.users_cards}>
                    {
                        sortedChannelUsers?.map((user, index)=>{
                            let userData;
                            if (user !==  currentUser.id)
                                userData = userContacts.get(user)
                            else
                                userData = {avatar:currentUser.avatar, username:currentUser.username}
                            const userRole = getUserRole (user, channelData)
                            const cardKey = `${index}_${user}`;
                            console.log('cardKey', cardKey)

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
                </div>
        </div>
        }
        </>
    )
}