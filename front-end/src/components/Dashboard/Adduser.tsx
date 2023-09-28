import React, {useEffect, useState} from "react";
import {FaSearch} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

function AddUser()
{
    const [searchQuery, setsearchQuery] = useState('');
    const [userFriend, setuserFriend] = useState<{ id: string; username: string; avatar: string; status: string }[]>([]);
    const [updateFriend, setupdateFriend] = useState<{id: string; username: string; avatar: string; status: string }[]>([]);
    const [socket, setsocket] = useState<Socket| null>(null);
    const JwtToken = Cookies.get("access_token");

    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://localhost:3001', {
              transports: ['websocket'],
              query: {
                  token: `Bearer ${JwtToken}`,
              }
            });
      
            newSocket.on('connect', () => {
              setsocket(newSocket);
            });
      
            newSocket.on('disconnect', () => {
            });
    
          return () => {
            newSocket.disconnect();
          };
        }
      }, [JwtToken]);
    

    function handleclickButtom(user_id: string)
    {
        if (user_id && socket)
        {
            const notificationData = {
                user_id: user_id,
                type: 'ACCEPTED_INVITATION',
                token: `Bearer ${JwtToken}`,
            }
            if (notificationData)
            {
                socket.emit('sendNotification',notificationData);
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
                            {friend.status === "IN_GAME" && (
                                <div className="add-user-card ingame" key={friend.id}>
                                <div className="add-user-card-inde">
                                <img src={friend.avatar} alt="Photo" />
                                <p>{friend.username}</p>
                                </div>
                                <div>
                                <img src="ping-pong.png" alt="Photo" />
                                <h2>{friend.status}</h2>
                                </div>
                                <div>
                                    <div>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <button onClick={() => handleclickButtom(friend.id)}>Add USER</button>
                                    </div>
                                </div>
                               </div>
                            )}
                            {friend.status === "ONLINE" && (
                                <div className="add-user-card online" key={friend.id}>
                                <div className="add-user-card-inde">
                                <img src={friend.avatar} alt="Photo" />
                                <p>{friend.username}</p>
                                </div>
                                <div>
                                <img src="../new-moon.png" alt="Photo"/>
                                <h2>{friend.status}</h2>
                                </div>
                                <div>
                                    <div>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <button onClick={() => handleclickButtom(friend.id)}>ADD USER</button>
                                    </div>
                                </div>
                            </div>
                            )}
                            {friend.status === "OFFLINE" && (
                                <div className="add-user-card offline" key={friend.id}>
                                <div className="add-user-card-inde">
                                <img src={friend.avatar} alt="Photo"/>
                                <p>{friend.username}</p>
                                </div>
                                <div>
                                <img src="../yellowcircle.png" alt="Photo" width="10" height="10" />
                                <h2>{friend.status}</h2>
                                </div>
                                <div>
                                    <div onClick={() => handleclickButtom(friend.id)}>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <button>ADD USER</button>
                                    </div>
                                </div>
                            </div>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default AddUser;