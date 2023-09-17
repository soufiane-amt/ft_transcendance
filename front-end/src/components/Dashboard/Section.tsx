import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import GetCountryCode from "./GetCountryCode";

function Section()
{
    let total = 0;
    const [gameInformation, setgameInformation] = useState<{ win: number; losses: number; ladder_level: number }>();
    const [user, setUsers] = useState<{ id: number; username: string; status: string }>();
    const [latitude, setlatitude] = useState<number | null>(null);
    const [longitude, setlongitude] = useState<number | null>(null);
    const [countryInfo, setcontryInfo] = useState('');
    const [countryCode, setcountryCode] = useState('');
    const [image, setImage] = useState('backgroundrandom.jpg');

    const flagStyle = {
        width: '100%',
        height: '100%',
    };

    const sendData = async (background: File) => 
    {
        if (background)
        {   
            const formData = new FormData();
            const Header = new Headers();
            formData.append('file', background);

            Header.append('Authorization', 'background');
    
          try {
            const response = await fetch('http://localhost:3001/upload/file', {
              method: 'POST',
              body: formData,
              headers: Header
            });
    
            if (response.ok) {
              const data = await response.json();
              console.log('File uploaded successfully:', data);
            } else {
              console.error('File upload failed.');
            }
          } catch (error) {
            console.error('An error occurred during file upload:', error);
          }
        }
    }

    function handleImage(e: React.ChangeEvent<HTMLInputElement>)
    {
        const file = e.target.files?.[0];
        if (file)
        {
            const reader = new FileReader();
            reader.onloadend = () =>
            {
                if (typeof reader.result === 'string')
                {
                    setImage(reader.result);
                    sendData(file);
                }
            };
            reader.readAsDataURL(file);
        }
    }


    useEffect(() => {
        fetch('http://localhost:3001/api/Dashboard')
            .then((response) => {
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => setUsers(data))
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/api/Dashboard/game')
        .then((reponse) => {
            if (!reponse.ok)
                throw Error('Error in request');
            return reponse.json();
        })
        .then((data) => {setgameInformation(data)});
    }, []);
    useEffect(() => {
        if ("geolocation" in navigator)
        {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const {latitude, longitude} = position.coords;
                    setlatitude(latitude);
                    setlongitude(longitude);

                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const country = data.address.country;
                    setcontryInfo(country);
                    const code = GetCountryCode(country);
                    if (code)
                        setcountryCode(code);
                },
                (error) => {
                    console.log(error.message);
                }
            )
        }
    }, []);
    if (gameInformation?.win || gameInformation?.losses)
        total = gameInformation?.win + gameInformation?.losses;
    return (
        <div className="section-container">
            
            <div className="section-image">
            <div className="parent-section-background">
                <div className="section-background">
                    <label htmlFor="choose">Change background profile</label>
                    <input type="file" onChange={handleImage} accept="image/*" id="choose" />
                </div>
                </div>
            <img src={image as string} alt="Photo" />
            </div>
            <div className="identification">
                <div className="identification-header one">
                <div className="identification-information">
                    <h3>Total Game</h3>
                    <p>{total}</p>
                </div>
                <hr id="section-line"></hr>
                <div className="identification-information">
                    <h3>Wins</h3>
                    <p>{gameInformation?.win}</p>
                </div>
                <hr id="section-line"></hr>
                <div className="identification-information">
                    <h3>Loss</h3>
                    <p>{gameInformation?.losses}</p>
                </div>
                </div>
                <div className="parent-identification-user">
                    <div className="identification-user">
                        <img src="../user.jpg" alt="Photo" width={130} height={130} />
                        <div className="level"><p>{gameInformation?.ladder_level}</p></div>
                        <p id="nameuser">{user?.username}</p>
                    </div>
                </div>
                <div className="identification-header two">
                <div className="identification-information">
                    <h3>Location</h3>
                    {countryInfo && (
                        <div className="location">
                            <div className="flag"><ReactCountryFlag countryCode={countryCode} svg style={flagStyle} /></div>
                            <p>{countryInfo}</p>
                        </div>
                    )}
                </div>
                <hr id="section-line"></hr>
                <div className="identification-information rank">
                    <h3>Rank</h3>
                    <p>32</p>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Section;