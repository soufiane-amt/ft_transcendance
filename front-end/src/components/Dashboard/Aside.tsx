import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";

interface AsideProps 
{
    onSelectSection: (section: string) => void;
}

const Aside: React.FC<AsideProps> = ({onSelectSection}) =>
{
    let totalonlineUsers: number;
    const [isactivedashboard, setisactivedashboard] = useState(true);
    const [isactiveadduser, setisactiveadduser] = useState(true);
    const [isactiveafriend, setisactivefriend] = useState(true);
    const [isactiveachat, setisactivechat] = useState(true);
    const [Users, setUsers] = useState<{ id: number; username: string; status: string }[]>([]);
    const JwtToken = Cookies.get("access_token");

    totalonlineUsers = 0;
    useEffect(() => {
        fetch('http://localhost:3001/api/Dashboard/friends', {
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
    }, [JwtToken]);
    
    function handleuparrow()
    {
        setisactivedashboard(!isactivedashboard);
    }
    Users.map((user) => {
        if (user.status === 'ONLINE' || user.status === 'IN_GAME')
            totalonlineUsers++;
    })
    function handleuparrowadduser()
    {
        setisactiveadduser(!isactiveadduser);
    }

    function handleuparrowfriend()
    {
        setisactivefriend(!isactiveafriend);
    }

    function handleuparrowchat()
    {
        setisactivechat(!isactiveachat);
    }
    return (
        <div className="left-aside">
        <aside>
            <div className="myaside">
                <div className="myaside1">
                <img src="../new-moon.png" alt="Photo" width={10} height={10} />
                <p>Connected</p>
                </div>
                <div className="myaside2">
                <img src="../new-moon.png" alt="Photo" width={10} height={10} />
                <p><span>{totalonlineUsers}</span>Players online</p>
                </div>
            </div>
            <hr id="aside-line"></hr>
            <div className="myaside">
                <div className="myaside1 aside">
                    <h3>Dashboard</h3>
                    <img src="../up-arrow.png" alt="Photo" width={20} height={20} onClick={handleuparrow} />
                </div>
               {isactivedashboard && (
                <>
                <div className="homepage" onClick={() => onSelectSection("home")} >
                    <img src="../home.png" alt="Photo" width={20} height={20} />
                    <button>Home</button>
                </div>
                <div className="homepage" onClick={() => onSelectSection("statistic")}>
                    <img src="../bar-chart.png" alt="Photo" width={20} height={20} />
                    <button>Statistic</button>
                </div>
                <div className="homepage" onClick={() => onSelectSection("friends")}>
                    <img src="../group.png" alt="Photo" width={20} height={20} />
                    <button>Friends</button>
                </div>
                <div className="homepage" onClick={() => onSelectSection("history")}>
                        <img src="../history.png" alt="Photo" width={20} height={20} />
                        <button>History</button>
                </div>
                </>
               )}
            </div>
            <hr id="aside-line"></hr>
            <div className="myaside">
                <div className="myaside1 aside">
                    <h3>Users</h3>
                    <img src="../up-arrow.png" alt="Photo" width={20} height={20} onClick={handleuparrowadduser}/>
                </div>
                {isactiveadduser && (
                        <div className="homepage" onClick={() => onSelectSection("add-user")}>
                        <img src="../add-user (3).png" alt="Photo" width={20} height={20} />
                        <button>Add Users</button>
                        </div>
                )}
            </div>
            <hr id="aside-line"></hr>
            <div className="myaside">
                <div className="myaside1 aside">
                    <h3>Game PLay</h3>
                    <img src="../up-arrow.png" alt="Photo" width={20} height={20} onClick={handleuparrowfriend} />
                </div>
                {isactiveafriend && (
                    <div className="homepage">
                    <img src="../games (1).png" alt="Photo" width={20} height={20} />
                    <button>Game Play</button>
                    </div>
                )}
            </div>
            <hr id="aside-line"></hr>
            <div className="myaside">
                <div className="myaside1 aside">
                    <h3>Chat</h3>
                    <img src="../up-arrow.png" alt="Photo" width={20} height={20} onClick={handleuparrowchat} />
                </div>
                {isactiveachat && (
                    <div className="homepage">
                    <img src="../space.png" alt="Photo" width={22} height={22} />
                    <button>Chat Space</button>
                    </div>
                )}
            </div>
        </aside>
        </div>
    );
};

export default Aside;