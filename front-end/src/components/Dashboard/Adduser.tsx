'use client';
import React, {useEffect, useState} from "react";
import {FaSearch} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faClock } from '@fortawesome/free-solid-svg-icons';
import Cookies from "js-cookie";
import { showToast } from "./ShowToast";
import newSocket from "../GlobalComponents/Socket/socket";
function AddUser()
{
    const [searchQuery, setsearchQuery] = useState('');
    const [userFriend, setuserFriend] = useState<{ id: string; username: string; avatar: string; status: string, pending?: boolean }[]>([]);
    const [updateFriend, setupdateFriend] = useState<{id: string; username: string; avatar: string; status: string, pending?: boolean }[]>([]);
    const [clickedUsers, setClickedUsers] = useState<string[]>([]);
    const JwtToken = Cookies.get("access_token");

    function handleclickButtom(user_id: string, username: string)
    {
        if (user_id && newSocket)
        {
            const notificationData = {
                user_id: user_id,
                type: 'FRIENDSHIP_REQUEST',
                token: `Bearer ${JwtToken}`,
            }
            if (notificationData)
            {
                newSocket.emit('sendNotification',notificationData);
                showToast(`Friend Request To ${username}`, "success");
                setClickedUsers(prevClickedUsers => [...prevClickedUsers, user_id]);
            }
        }
    }
    useEffect(() => {
        fetch('http://localhost:3001/api/Dashboard/allUsers', {
            method: 'Get',
            headers: {
              'Authorization' : `Bearer ${JwtToken}`,
              'Content-Type': 'application/json',
            }
          })
            .then((response) => {
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => setuserFriend(data))
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [JwtToken]);

    // useEffect(() => {
    //     fetch('http://localhost:3001/api/Dashboard/allUsers/filter', {
    //         method: 'Get',
    //         headers: {
    //           'Authorization' : `Bearer ${JwtToken}`,
    //           'Content-Type': 'application/json',
    //         }
    //       })
    //         .then((response) => {
    //             if (!response.ok)
    //                 throw new Error('Network response was not ok');
    //             return response.json();
    //         })
    //         .then((data) => setnewuserFriend(data))
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         });
    // }, [JwtToken]);

    useEffect(() => 
    {
        if (searchQuery === '')
            setupdateFriend(userFriend);
        else
        {
            const filterFriends = userFriend.filter((friend) => 
                friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setupdateFriend(filterFriends);
        }
    }, [searchQuery, userFriend]);
    return (
        <div className="usercomponent">
            <div className="userheader">
                <h3>Users</h3>
                <hr></hr>
            </div>
            <div className="Add-user">
                <div className="add-user-button">
                <div>
                <input type="text" placeholder="Find Friend" onChange={(e) => setsearchQuery(e.target.value)} />
                <button type="submit"><FaSearch></FaSearch></button>
                </div>
                </div>
                <div className="add-user-list">
                    {updateFriend.map((friend) => 
                    (
                        <section className="add-user-list-card" key={friend.id}>
                                <div className="add-user-card ingame" key={friend.id}>
                                <div className="add-user-card-inde">
                                <img src={friend.avatar} alt="Photo" />
                                <p>{friend.username}</p>
                                </div>
                                <div>
                                </div>
                                <div>
                                {clickedUsers.includes(friend.id) || friend.pending === true ? (
                                    <div id="btn-pedding" style={{ cursor: 'auto', backgroundColor: '#BFBEBD' }}>
                                    <FontAwesomeIcon icon={faClock} style={{ cursor: 'auto', backgroundColor: '#BFBEBD' }} />
                                    <button style={{ cursor: 'auto', backgroundColor: '#BFBEBD' }}>Pending</button>
                                    </div>
                                    ) : (
                                    <div>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <button onClick={() => handleclickButtom(friend.id, friend.username)}>Add User</button>
                                    </div>
                                )}
                                </div>
                               </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default AddUser;