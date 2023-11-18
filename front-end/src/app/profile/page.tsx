"use client";
import "@/styles/Dashboard.css";
import Structure from "@/app/Structure";
import DisplayComponent from "@/components/Dashboard/DisplayComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Section from "@/components/Dashboard/Section";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Aside from "@/components/Dashboard/Aside";

function Dashboard() {
  const router = useRouter();
  const [name, setname] = useState("");
  const JwtToken = Cookies.get("access_token");
  const [friend, setfriend]: any = useState();
  const [image, setImage] = useState("backgroundrandom.jpg");

  useEffect(() => {
    if (url.searchParams.has("username") && url.searchParams.size === 1) {
      const username = url.searchParams.get("username");
      if (username) setname(username);
      else {
      }
      console.log("Username:", username);
    } else {
    }
    if (name) {
      fetch(`http://localhost:3001/api/profile/${name}`, {
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
          setfriend(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [name]);

  const url = new URL(`${window.location}`);

  // Check if the URL has only the 'username' parameter

  return (
    <div className="mybody ">
      <Structure>
        <div className="section-container">
          <div className="section-image">
            <div className="parent-section-background">
              <div className="section-background">
                <label htmlFor="choose">Change background profile</label>
                <input type="file" accept="image/*" id="choose" />
              </div>
            </div>
            <img src={friend?.background || (image as string)} alt="Photo" />
          </div>
          <div className="identification">
            <div className="identification-header one">
              <hr id="section-line"></hr>

              <div className="identification-information">
                <h3>Wins</h3>
                <p>{friend?.wins}</p>
              </div>
              <hr id="section-line"></hr>
              <div className="identification-information">
                <h3>Loss</h3>
                <p>{friend?.losses}</p>
              </div>
            </div>
            <div className="parent-identification-user">
              <div className="identification-user">
                <img
                  src={friend?.avatar}
                  alt="Photo"
                  width={130}
                  height={130}
                />
                <div className="level">
                  <p>{friend?.ladder_level}</p>
                </div>
                <p id="nameuser">{friend?.username}</p>
              </div>
            </div>
            <div className="identification-information">
              <h3>Total Game</h3>
              <p>{friend?.wins + friend?.losses}</p>
            </div>
            <hr id="section-line"></hr>
            <div className="identification-information">
              <h3>Level</h3>
              <p>{friend?.ladder_level}</p>
            </div>
            <hr id="section-line"></hr>
          </div>
        </div>
      </Structure>
    </div>
  );
}

export default Dashboard;
