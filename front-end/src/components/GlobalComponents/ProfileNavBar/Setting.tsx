"use client";

import SettingCss from "./Setting.module.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import DashboardTwoFa from "@/components/2fa/DashboardTwoFa";
import { showToast } from "@/components/Dashboard/ShowToast";

interface Settingprops {
  handleSettingData: (data: boolean) => void;
}

interface Data {
  image: string;
  name: string;
  twofactor: string;
}

const Setting: React.FC<Settingprops> = ({ handleSettingData }) => {
  const [twofa, setTwofa] = useState(false);
  const [selectedFile, setSelectedFile]: any = useState(null);
  const JwtToken = Cookies.get("access_token");
  const [user, setUsers] = useState<any>(null);
  const [image, setImage] = useState(user ? user.avatar : null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    if (event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (JwtToken) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/api/Dashboard`, {
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
          setUsers(data);
          setImage(data.avatar);
        })
        .catch((error) => {
          // console.error("Error:", error);
        });
    }
  }, [JwtToken]);

  const handleUpload = async (event: any) => {
    event.preventDefault();
    try {
      const formData: any = new FormData();
      formData.append("file", selectedFile);

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/upload/file`, {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${JwtToken}`,
        },
      }).then((response) => {
        if (response.status === 400) {
          showToast("Failed Upload File", "error");
          console.clear();
        }
      });
    } catch (error: any) {
      console.clear();
    }
  };

  function close() {
    handleSettingData(true);
  }

  return (
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
          <img src={image} alt="Photo" width="100" height="100" />
          <div className={SettingCss.choose_img}>
            <label htmlFor="choose">Change photo profile</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              id="choose"
              className={SettingCss.choose}
            ></input>
          </div>
          <form>
            <div className={SettingCss.two_factor}>
              <FontAwesomeIcon
                icon={faShieldAlt}
                id={SettingCss.two_factor_icon}
              />
              {/* modified by abdellag */}
              <button
                onClick={(event: any) => {
                  event.preventDefault();
                  !twofa ? setTwofa(true) : setTwofa(false);
                }}
              >
                two-factor authentication
              </button>
            </div>
            <button onClick={handleUpload} id={SettingCss.conform}>
              Confirm
            </button>
          </form>
        </div>
      </div>
      {twofa && <DashboardTwoFa setTwoFa={setTwofa}></DashboardTwoFa>}
    </div>
  );
};

export default Setting;
