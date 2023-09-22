"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import SettingCss from "./Setting.module.css";
import DashboardTwoFa from "@/components/2fa/DashboardTwoFa";

interface Settingprops {
  handleSettingData: (data: boolean) => void;
}

interface Data {
  image: string;
  name: string;
  twofactor: string;
}

const Setting: React.FC<Settingprops> = ({ handleSettingData }) => {
  const [image, setImage] = useState("user.jpg"); // change user
  const [searchQuery, setsearchQuery] = useState("");
  const [twofactor, settwofactor] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [twofa, setTwofa] = useState(false); /// by abdellah


  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    handleImage(event);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("http://localhost:3001/upload/file", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("File uploaded successfully:", data);
        } else {
          console.error("File upload failed.");
        }
      } catch (error) {
        console.error("An error occurred during file upload:", error);
      }
    }
    sendData();
  };

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const sendData = async () => {
    if (searchQuery) {
      const formData = new FormData();
      // formData.append('file', selectedFile);
      const datasend = { inputsearch: searchQuery, twofactor: twofactor };
      try {
        const response = await fetch(
          "http://localhost:3001/api/Dashboard/setting",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: datasend }),
          }
        );
      } catch (error) {
        console.error("Error sending data : ", error);
      }
    }
  };
  function close() {
    handleSettingData(true);
  }

  return (
    <>
    <div className={SettingCss.setting}>
      <div className={SettingCss.div_setting}>
        <div className={SettingCss.close_setting}>
          <img
            src="../close.png"
            alt="Photo"
            width="15"
            height="15"
            style={{ cursor: "pointer" }}
            onClick={close}
          />
        </div>
        <div className={SettingCss.setting_form}>
          <img src={image as string} alt="Photo" width="100" height="100" />
          <div className={SettingCss.choose_img}>
            <label htmlFor="choose">Change photo profile</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              id="choose"
            ></input>
          </div>
          <form>
            <div className={SettingCss.two_factor}>
              <FontAwesomeIcon
                icon={faShieldAlt}
                id={SettingCss.two_factor_icon}
              />
              {/* modified by abdellag */}
              <button onClick={(event : any) => {event.preventDefault(); !twofa ? setTwofa(true): setTwofa(false)}}> 
                two-factor authentication
              </button>
            </div>
            <button onClick={handleUpload} id="conform">
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
      {twofa &&  <DashboardTwoFa setTwoFa={setTwofa}></DashboardTwoFa>}

      

      </>
  );
};

export default Setting;
