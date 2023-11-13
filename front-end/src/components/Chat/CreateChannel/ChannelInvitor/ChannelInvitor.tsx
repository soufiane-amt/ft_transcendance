import { useState } from "react";
import style from "../../../../styles/ChatStyles/ChannelInvitor.module.css";
import { useOutsideClick } from "../../../../CustomHooks/useOutsideClick";


type userItemType = { username:string, avatar :string|undefined,}

interface UserItemProps{
    userCardData : userItemType
    extraStyle:any,
    handleUserClick: () =>void
}
function UserItemCard ({userCardData, extraStyle, handleUserClick}:UserItemProps)
{
    return (
        <li key={userCardData.username} className={`${style.user_card_item} ${extraStyle}`}
            onClick={handleUserClick}>
            <img src={userCardData.avatar}/>
            <span>{userCardData.username}</span>
        </li>
    )
}



interface ChannelInvitorProps {
    userCondidates: Map<string, string>,
    handleVisibility: ()=>void,
    onConfirm : (invitedUsers: string[])=> void
}
export function ChannelInvitor({userCondidates, onConfirm, handleVisibility}: ChannelInvitorProps) {
    const usersList = Array.from(userCondidates.keys());
    const [searchedUsers, setSearchedUsers] = useState<string[]>(usersList);
    const [searchedUsername, setSearchedUsername] = useState<string>('');
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
    const ref = useOutsideClick(handleVisibility);

    const handleClickUser = (username: string) => {
        if (invitedUsers.includes(username)) {
            setInvitedUsers(invitedUsers.filter((user) => user !== username));
        } else {
            setInvitedUsers([...invitedUsers, username]);
        }
    };

    const checkUserInvited = (username: string) => {
        return invitedUsers.includes(username);
    };

    const handleSearch = (e: any) => {
        const searchTerm = e.target.value;
        setSearchedUsername(searchTerm);
    
        if (searchTerm) {
            const filteredUsers = searchedUsers.filter((user) =>
                user.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchedUsers(filteredUsers);
        } 
        else {
            setSearchedUsers(usersList);
        }
    };  

    const handleConfirm = () => {
        onConfirm(invitedUsers);
        window.location.reload();
    }
        return (
        <div   className={style.dark_background}>

            <div ref={ref} className={style.user_invitor_modal}>
                {/* <h3>Include users to the channel:</h3> */}
                <div className={style.user_invitor_modal_search}>
                    <input
                    type="text"
                    placeholder="Search friends ..."
                    value={searchedUsername}
                    onChange={handleSearch}
                    />
                </div>
            <div className={style.user_invitor_modal_selection}>
                <ul>
                {searchedUsers.map((user) => (
                        <UserItemCard userCardData={{username:user, avatar: userCondidates.get(user)}} 
                                extraStyle={checkUserInvited(user) ? style.selected : ''}
                                handleUserClick={() => handleClickUser(user)}/>
                ))}
                </ul>
            </div>
            <div className={style.user_invitor_modal_confirm}>
                <button  onClick={handleConfirm}>Confirm and Create</button>
            </div>
        </div>
        </div>
    );
}
