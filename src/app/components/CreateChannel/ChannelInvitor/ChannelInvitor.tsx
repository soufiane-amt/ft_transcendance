import { useState } from "react";
import style from "./ChannelInvitor.module.css";

export function ChannelInvitor() {
    const allUsers = [
        'user1',
        'user2',
        'user3',
        'user4',
        'user5',
    ];

    const [searchedUsers, setSearchedUsers] = useState<string[]>(allUsers);
    const [searchedUsername, setSearchedUsername] = useState<string>('');
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

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
            const filteredUsers = allUsers.filter((user) =>
                user.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchedUsers(filteredUsers);
        } else {
            setSearchedUsers(allUsers);
        }
    };
        return (
        <div className={style.user_invitor_modal}>
            <h3>Include users to the channel:</h3>
            <div className={style.user_invitor_modal_search}>
                <input
                    type="text"
                    placeholder="Type in the username ..."
                    value={searchedUsername}
                    onChange={handleSearch}
                />
            </div>
            <div className={style.user_invitor_modal_selection}>
                <label>Click to select the users to include:</label>
                <ul>
                {searchedUsers.map((username) => (
                        <li
                            key={username}
                            className={checkUserInvited(username) ? style.selected : ''}
                            onClick={() => handleClickUser(username)}
                        >
                            {username}
                        </li>
                    ))}
                    {searchedUsers.map((username) => (
                        <li
                            key={username}
                            className={checkUserInvited(username) ? style.selected : ''}
                            onClick={() => handleClickUser(username)}
                        >
                            {username}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <button>Confirm</button>
            </div>
        </div>
    );
}
