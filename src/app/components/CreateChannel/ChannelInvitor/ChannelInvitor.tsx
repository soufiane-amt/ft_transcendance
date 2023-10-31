import { useState } from "react";
import style from "./ChannelInvitor.module.css";
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";


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
    handleVisibility: ()=>void
}
export function ChannelInvitor({handleVisibility}: ChannelInvitorProps) {
    const map = new Map <string, string>() 
    map.set('samajat', 'http://localhost:3001/chat/image/6ba7b810-9dad-11d1-80b4-00c04fd430c8.png')
    map.set('batman50', 'http://localhost:3001/chat/image/550e8400-e29b-41d4-a716-446655440000.jpeg')
    map.set('johnSnow67', 'http://localhost:3001/chat/image/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpeg')

    const list= ['samajat', 'batman50', 'johnSnow67',]
    const [searchedUsers, setSearchedUsers] = useState<string[]>(list);
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
            setSearchedUsers(list);
        }
    };
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
                {/* <label>Select the users to include:</label> */}
                <ul>
                {searchedUsers.map((user) => (
                        // <li
                        //     key={user}
                        //     className={checkUserInvited(user) ? style.selected : ''}
                        //     onClick={() => handleClickUser(user)}
                        // >
                        //     {user}
                        // </li>
                        <UserItemCard userCardData={{username:user, avatar: map.get(user)}} 
                                extraStyle={checkUserInvited(user) ? style.selected : ''}
                                handleUserClick={() => handleClickUser(user)}/>
                ))}
                {searchedUsers.map((user) => (
                        // <li
                        //     key={user}
                        //     className={checkUserInvited(user) ? style.selected : ''}
                        //     onClick={() => handleClickUser(user)}
                        // >
                        //     {user}
                        // </li>
                        <UserItemCard userCardData={{username:user, avatar: map.get(user)}} 
                                extraStyle={checkUserInvited(user) ? style.selected : ''}
                                handleUserClick={() => handleClickUser(user)}/>
                ))}
                {searchedUsers.map((user) => (
                        // <li
                        //     key={user}
                        //     className={checkUserInvited(user) ? style.selected : ''}
                        //     onClick={() => handleClickUser(user)}
                        // >
                        //     {user}
                        // </li>
                        <UserItemCard userCardData={{username:user, avatar: map.get(user)}} 
                                extraStyle={checkUserInvited(user) ? style.selected : ''}
                                handleUserClick={() => handleClickUser(user)}/>
                ))}
                </ul>
            </div>
            <div className={style.user_invitor_modal_confirm}>
                <button  onClick={handleVisibility}>Confirm and Create Channel</button>
            </div>
        </div>
        </div>
    );
}
