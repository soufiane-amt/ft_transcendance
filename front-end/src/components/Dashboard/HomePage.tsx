import React, { useEffect, useState } from "react";
import {FaSearch} from 'react-icons/fa';

function HomePage()
{
    const [userFriend, setuserFriend] = useState<{id: number; username: string; status: string}[]>([]);
    const [updateFriend, setupdateFriend] = useState<{id: number; username: string; status: string}[]>([]);
    const [selectValue, setselectValue] = useState('all-user');
    const [searchQuery, setsearchQuery] = useState('');

    const handleInputChange = (event : any) => 
    {
        setselectValue(event.target.value);
    }
    useEffect(() => 
    {
        if (searchQuery === '')
        {
            if (selectValue != 'all-user')
            {
                const filterFriends = userFriend.filter((friend) => 
                friend.status.toLowerCase().includes(selectValue.toLowerCase())
                );
                setupdateFriend(filterFriends);
            }
            else
                setupdateFriend(userFriend);
        }
        else
        {
            const filterFriends = userFriend.filter((friend) => 
                friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setupdateFriend(filterFriends);
        }
    }, [searchQuery, selectValue, userFriend]);
    
    useEffect(() => {
        fetch('http://localhost:3001/api/Dashboard/friends')
            .then((response) => {
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => setuserFriend(data))
    }, []);
    return (
        <>
        <div className="home-page-counting">
           <div className="home-page-search">
                <input type="text" placeholder="Search Users" value={searchQuery} onChange={(e) => setsearchQuery(e.target.value)}>
                </input>
                <button type="submit"><FaSearch></FaSearch></button>
            </div>
            <div className="home-page-choose">
            <select name="pets" id="pet-select" value={selectValue} onChange={handleInputChange}>
                <option  value="all-user">All Users</option>
                <option  value="ONLINE">Online Users</option>
                <option value="IN_GAME">In Game</option>
                <option value="OFFLINE">Offline</option>
            </select>
            </div>
           </div>
            <div className="informationaboutuser">
                {updateFriend.map(friend => (
                        <div className="container-user" key={friend.id}>
                        <div className="nameuser">
                            <img src="images.png" width={42} height={42}></img>
                            <h2>{friend.username}</h2>
                        </div>
                        {friend.status === 'IN_GAME' && 
                        <div className="isconnected ingame">
                            <img src="ping-pong.png" width={14} height={14}></img>
                            <h2>In Game</h2>
                        </div>
                        }
                        {friend.status === 'ONLINE' && 
                        <div className="isconnected online" >
                             <img src="../new-moon.png" alt="Photo" width="10" height="10" />
                            <h2>Online</h2>
                        </div>
                        }
                        {friend.status === 'OFFLINE' && 
                        <div className="isconnected offline">
                            <img src="../yellowcircle.png" alt="Photo" width="10" height="10" />
                            <h2>Offline</h2>
                        </div>
                        }
                        </div>
                ))}
                </div>
        </>
    )
};
export default HomePage;