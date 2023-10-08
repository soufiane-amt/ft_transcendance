import { faClock, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useState, useEffect} from "react";
import Setting from "./Setting";
import NavBarCSS from './NavBar.module.css';
import Cookies from "js-cookie";
import { showToast } from "@/components/Dashboard/ShowToast";
import { toast } from "react-toastify";
import CustomToast from "@/components/Dashboard/CustomToast";
import { useRouter } from "next/navigation";
import newSocket from "../Socket/socket";


function NavBar()
{
    const [isVisible, setIsVisible] = useState(false);
    const [notification, setnotification] = useState(false);
    const [settingindex, setsettingindex] = useState(false);
    const [closeindex, setcloseindex] = useState(false);
    const [user, setUsers] = useState<any>(null);
    const [userFriend, setuserFriend] = useState<{id: string; username: string; avatar: string; status: string, pending?: boolean }[]>([]);
    const [updateFriend, setupdateFriend] = useState<{id: string; username: string; avatar: string; status: string, pending?: boolean }[]>([]);
    const [searchUser, setsearchUser] = useState(false);
    const [searchQuery, setsearchQuery] = useState('');
    const [notificationrequest, setnotificationrequest] = useState(false);
    const [clickedUsers, setClickedUsers] = useState<string[]>([]);
    const [tablenotification, settablenotification] = useState<{id_notif: string, id: string; user2Username: string; user2Avatar: string; type: string}[]>([]);
    const JwtToken = Cookies.get("access_token");
    let count = 0;
    const router = useRouter();

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
      if (JwtToken)
      {
          fetch('http://localhost:3001/api/Dashboard', {
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
          .then((data) => setUsers(data))
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }, [user, JwtToken]);

    const handlesearchuser = (e: any) =>
    {
        const value = e.target.value;
        setsearchQuery(value);
        if (value.trim() !== '') {
            setsearchUser(true);
        }
        else {
            setsearchUser(false);
        }
    }

    function handlecloseindex()
    {
        setcloseindex(!closeindex);
        setsettingindex(false);
    }

    function handleeventimage()
    {
        setIsVisible(!isVisible);
    }

    function handlenotifaction()
    {
        setnotification(!notification);
        setnotificationrequest(false);
    }

    function accept_request(user_id : string, username: string)
    {
        const notificationData = {
            user_id: user_id,
            response: 'accept',
            token: `Bearer ${JwtToken}`,
        }
        if (newSocket)
        {
            newSocket.emit('responserequest', notificationData);
            showToast(`add ${username}`, 'add');
        }
    }

    function handleme()
    {
        setcloseindex(false);
        setsettingindex(!settingindex);
    }

    const handlelogout = async (e : any) =>
    {
        try
        {
            fetch('http://localhost:3001/api/Dashboard/logout', {
              method: 'POST',
              headers: {
                'authorization' : `Bearer ${JwtToken}`,
              }
            }).then((response) => {
                console.log(response);
            });
        }
        catch (error)
        {
            console.clear();
        }
        Cookies.remove('access_token', { path: '/' });
    }

    useEffect(() => {
        newSocket.on('changestatus', (user: any) => {
            setUsers(user);
        })
    })

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
    }, [JwtToken, userFriend]);

    useEffect(() => {
        fetch('http://localhost:3001/api/Dashboard/notification', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JwtToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
            if (!response.ok)
                throw new Error('Network response was not ok');
            return response.json();
        })
        .then((data) => settablenotification(data))
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
    }, [JwtToken]);

    useEffect(() => {
          newSocket.on("notification", (notificationData) => {
            if (notificationData)
            {
                interface NotificationTableItem {
                    id_notif: number
                    id: number;
                    user2Username: string;
                    user2Avatar: string;
                    type: string;
                };
                const table: NotificationTableItem[] = [];

                if (notificationData && !notificationData.id_notif)
                {
                    notificationData.id_notif = count++;
                }
                const transformedData = {
                    id_notif: notificationData.id_notif,
                    id: notificationData.id,
                    user2Username: notificationData.username,
                    user2Avatar: notificationData.avatar,
                    type: 'FRIENDSHIP_REQUEST',
                };
                if (transformedData)
                {
                    setnotificationrequest(true);
                    settablenotification((prevTablenotification) => [
                      ...prevTablenotification,
                      transformedData,
                    ]);
                    toast(
                        <CustomToast id={1} obj={transformedData} onClose={(id) => toast.dismiss(id)} />,
                        {
                          position: toast.POSITION.TOP_CENTER,
                          closeButton: false, // If you want to hide the close button
                        }
                      );
                }
            }
          });
      }, []); // check

    useEffect(() => 
    {
        if (searchQuery !== '')
        {
            const filterFriends = userFriend.filter((friend) => 
                
                friend.username.toLowerCase() === searchQuery.toLowerCase()
            );
            setupdateFriend(filterFriends);
        }
    }, [searchQuery]);
    return (
        <>
        <div className={NavBarCSS.nav}>
            <div className={NavBarCSS.nav_search}>
            <div className={NavBarCSS.logo}>
              {/* onclick dahboard */}
                <img src="../myWhiteLogo.png" alt="Photo" width={100} height={90} onClick={(event: any) => {router.push("/dashboard");}}/> 
            </div>
            <div className={NavBarCSS.btn_search}>
            <button type="submit"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></button>
            <input type="text" placeholder="Search..." onChange={handlesearchuser}></input>
            {searchUser && (
                <div className={NavBarCSS.search}>
                {updateFriend.map((user) => (
                        <div className={NavBarCSS.search_user} key={user?.id}>
                        <div className={NavBarCSS.search_user_div}>
                            <div>
                            <img src={user.avatar} alt="Photo"/>
                            <p>{user.username}</p>
                            </div>
                            {clickedUsers.includes(user.id) || user.pending === true ? (
                                <FontAwesomeIcon icon={faClock} style={{ cursor: 'auto', margin: '5px' }} />
                            ) : (
                                <FontAwesomeIcon icon={faUserPlus} onClick={() => handleclickButtom(user.id, user.username)} />
                            )}
                            </div>
                        </div>
                ))}
                </div>
            )}
            </div>
            </div>
            <div className={NavBarCSS.nav_left}>
                <div className={NavBarCSS.nav_icon}>
                <div className={NavBarCSS.notification_msg}>
                    <span>2</span>
                    <img src="../chatroom.png" alt="Photo" width={20} height={20} />
                </div>
                <img src="../bell.png" alt="Photo" width={20} height={20} onClick={handlenotifaction} />
                {notificationrequest && (<div className={NavBarCSS.notification_request}><span></span></div>)}
                    {notification && (
                    <div className={NavBarCSS.click_icons}>
                        <>
                            {tablenotification.map((request) => {
                                {if (request.type === 'ACCEPTED_INVITATION') {
                                    return (<div className={NavBarCSS.click_icons_friend_request} key={request.id_notif}>
                                        <div className={NavBarCSS.click_icons_friend_request_msg}>
                                        <img src={request.user2Avatar} alt="Photo"/>
                                        <div><p id="notification-nameuser">{request.user2Username}</p><p> send you a friend follow request.</p></div>
                                        </div>
                                        <div className={NavBarCSS.click_icons_friend_request_button}>
                                            <button onClick={() => accept_request(request.id, request.user2Username)}><img src="checkmark.png" alt="Photo"></img></button>
                                        </div>
                                    </div>)
                                }
                                }
                                {if (request.type === 'FRIENDSHIP_REQUEST') {
                                    return (<div className={NavBarCSS.click_icons_friend_request} key={request.id_notif}>
                                        <div className={NavBarCSS.click_icons_friend_request_msg}>
                                        <img src={request.user2Avatar} alt="Photo"/>
                                        <div><p id="notification-nameuser">{request.user2Username}</p><p> send you a friend follow request.</p></div>
                                        </div>
                                        <div className={NavBarCSS.click_icons_friend_request_button}>
                                            <button onClick={() => accept_request(request.id, request.user2Username)}><img src="checkmark.png" alt="Photo"></img></button>
                                        </div>
                                    </div>)
                                }
                                }
                            })}
                        </>
                    </div>
                    )}
                </div>
                <div className={NavBarCSS.nav_name}>
                <p id={NavBarCSS.nameuser}>{user?.username}</p>
                <p id={NavBarCSS.online}><span>{user?.status}</span><img src="../new-moon.png" alt="Photo" width={10} height={10} /></p>
                </div>
         <div className={NavBarCSS.aa}>
         <img src={user?.avatar} alt="Photo" width={65} height={60} onClick={handleeventimage} />
            {isVisible && (
                <div className={NavBarCSS.click_img}>
                <div className={NavBarCSS.choice_first} onClick={handleme}>
                <img src="../setting.png" alt="Photo" width={18} height={18} />
                <div>
                    <button >
                        <span>Setting</span>
                    </button>
                </div>
                </div>
                <div className={NavBarCSS.choice_second}>
                <img src="../logout.png" alt="Photo" width={18} height={18} />
                <form>
                    <button onClick={handlelogout}>Log Out</button>
                </form>
                </div>
            </div>
            )}
         </div>
            </div>
        </div>
        {settingindex && ( !closeindex && (<Setting handleSettingData={handlecloseindex}></Setting>))}
        </>
    );
};


export default NavBar;