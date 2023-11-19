"use client";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import GetCountryCode from "./GetCountryCode";
import Cookies from "js-cookie";
import { showToast } from "./ShowToast";

function Section() {
  let total = 0;
  const [gameInformation, setgameInformation] = useState<{
    id: string;
    user_id: string;
    wins: number;
    losses: number;
    ladder_level: number;
  }>();
  const [user, setUsers] = useState<any>(null);
  const [latitude, setlatitude] = useState<number | null>(null);
  const [longitude, setlongitude] = useState<number | null>(null);
  const [countryInfo, setcontryInfo] = useState("");
  const [countryCode, setcountryCode] = useState("");
  const [image, setImage] = useState("backgroundrandom.jpg");
  const JwtToken = Cookies.get("access_token");
  const [rank, setrank] = useState(1);

  const flagStyle = {
    width: "100%",
    height: "100%",
  };

  const sendData = async (background: File, myfile: string) => {
    try {
      if (background) {
        const formData = new FormData();
        formData.append("file", background);

        fetch("http://localhost:3001/upload/file", {
          method: "POST",
          body: formData,
          headers: {
            authorization: `Bearer ${JwtToken}`,
            check: "background",
          },
        }).then((response) => {
          if (response.status === 400) {
            showToast("Failed Upload File", "error");
            console.clear();
          } else {
            setImage(myfile);
          }
        });
      }
    } catch (erro: any) {
      console.clear();
    }
  };

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          sendData(file, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    if (JwtToken) {
      fetch("http://localhost:3001/api/Dashboard", {
        method: "Get",
        headers: {
          Authorization: `Bearer ${JwtToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          if (data) {
            setUsers(data);
          } else {
            throw new Error("Received empty or invalid JSON data");
          }
        })
        .catch((error) => {
          // console.error("add user:", error);
        });
    }
  }, [user, JwtToken]);

  useEffect(() => {
    fetch("http://localhost:3001/api/Dashboard/game", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setgameInformation(data);
        } else {
          throw new Error("Received empty or invalid JSON data");
        }
      })
      .catch((error) => {
        // console.error("Error:", error);
      });
  }, [gameInformation, JwtToken]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setlatitude(latitude);
            setlongitude(longitude);

            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const country = data.address.country;
            setcontryInfo(country);
            const code = GetCountryCode(country);
            if (code) setcountryCode(code);
          } catch (error) {
            // console.error("An error occurred:", error);
          }
        },
        (error) => {
          console.log(error.message);
        }
      );
    }
  }, []);
  useEffect(() => {
    fetch("http://localhost:3001/api/Dashboard/RankUsers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          const Tab: any[] = data;
          if (gameInformation) {
            let Rank = 1;
            Tab.map((friend) => {
              if (friend.ladder_level > gameInformation?.ladder_level) Rank++;
            });
            setrank(Rank);
          }
        } else {
          throw new Error("Received empty or invalid JSON data");
        }
      })
      .catch((error) => {
        // console.error("Error:", error);
      });
  }, [gameInformation, rank]);
  if (gameInformation?.wins || gameInformation?.losses)
    total = gameInformation?.wins + gameInformation?.losses;

  return (
    <div className="section-container">
      <div className="section-image">
        <div className="parent-section-background">
          <div className="section-background">
            <label htmlFor="choose">Change background profile</label>
            <input
              type="file"
              onChange={handleImage}
              accept="image/*"
              id="choose"
            />
          </div>
        </div>
        <img src={user?.background || (image as string)} alt="Photo" />
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
            <p>{gameInformation?.wins}</p>
          </div>
          <hr id="section-line"></hr>
          <div className="identification-information">
            <h3>Loss</h3>
            <p>{gameInformation?.losses}</p>
          </div>
        </div>
        <div className="parent-identification-user">
          <div className="identification-user">
            <img src={user?.avatar} alt="Photo" width={130} height={130} />
            <div className="level">
              <p>{gameInformation?.ladder_level}</p>
            </div>
            <p id="nameuser">{user?.username}</p>
          </div>
        </div>
        <div className="identification-header two">
          <div className="identification-information">
            <h3>Location</h3>
            {countryInfo && (
              <div className="location">
                <div className="flag">
                  <ReactCountryFlag
                    countryCode={countryCode}
                    svg
                    style={flagStyle}
                  />
                </div>
                <p>{countryInfo}</p>
              </div>
            )}
          </div>
          <hr id="section-line"></hr>
          <div className="identification-information rank">
            <h3>Rank</h3>
            <p>{rank}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section;
