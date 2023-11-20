"use client";
import { useEffect, useRef, useState } from "react";
import style from "../../../styles/ChatStyles/CreateChannel.module.css";
import UploadChannelIcon from "../../../../public/chatIcons/icons/CreateChannel/UploadChannelIcon.jpg";
import { ChannelInvitor } from "./ChannelInvitor/ChannelInvitor";
import socket from "../../../app/socket/socket";
import { fetchDataFromApi } from "../CustomFetch/fetchDataFromApi";
import axios from "axios";
import Cookies from "js-cookie";

const MaxChannelNameLength = 15;
const MinChannelNameLength = 3;
const MaxPasswordLength = 50;
const MinPasswordLength = 8;

export function CreateChannel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [channelName, setChannelName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [channelType, setChannelType] = useState("PUBLIC");
  const [displayChannelInvitor, setDisplayChannelInvitor] =
    useState<boolean>(false);

  const [image, setImage] = useState<FormData | null>(null);
  const jwtToken = Cookies.get("access_token");

  const setDataToDefault = () => {
    setChannelName("");
    setPassword("");
    setChannelType("PUBLIC");
  };
  const [condidateUsers, setUserCondidates] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  useEffect(() => {
    async function fetchDataAsync() {
      const messagesHistory_tmp = await fetchDataFromApi(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/memberCondidatesOfChannelCreation`
      );
      const condidateUsers_tmp = new Map<string, string>();
      messagesHistory_tmp?.forEach((user: any) => {
        condidateUsers_tmp.set(user.username, user.avatar);
      });
      setUserCondidates(condidateUsers_tmp);
    }
    fetchDataAsync();
  }, []);

  //send a post request to the server to get usernames along with their avatars
  const handleSubmitData = async (invitedUsers: string[]) => {
    if (!image) {
      alert("Please choose a picture for the channel!");
      return;
    }

    if (channelName.length < MinChannelNameLength) {
      alert(
        `Your channel name must be at least ${MinChannelNameLength} characters long!`
      );
      return;
    }

    if (channelType === "PROTECTED" && password.length < MinPasswordLength) {
      alert(
        `Your password must be at least ${MinPasswordLength} characters long!`
      );
      return;
    }
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/upload`, image, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          // Continue with the rest of your createChannel logic
          socket.emit("createChannel", {
            channelName,
            imageSrc: res.data.imageSrc,
            channelType,
            password,
            invitedUsers,
          });
          setDataToDefault();
        }
      });
  };

  const handleImageChange = (event: any) => {
    const selectedFile = event.target.files[0];

    // Check if a file is selected
    if (selectedFile) {
      // Check if the selected file is an image
      if (selectedFile.type && selectedFile.type.includes("image")) {
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);
        setImage(formData);
      } else {
        // Display a warning or handle the non-image file case
        alert("Please choose a valid image file.");
        // Optionally, you can clear the selected file to prevent further processing
        event.target.value = null;
      }
    }
  };
  const handleChannelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (
      inputText.length <= MaxChannelNameLength &&
      inputText[inputText.length - 1] !== " "
    ) {
      setChannelName(inputText);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (
      inputText.length <= MaxPasswordLength &&
      inputText[inputText.length - 1] !== " "
    ) {
      setPassword(inputText);
    }
  };

  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChannelType(event.target.value);
  };

  const handleClickUpload = () => {
    fileInputRef.current!.click();
  };

  const handleInviteUsersModal = () => {
    //Check if channel name and password and image are valid

    if (channelName.length < MinChannelNameLength) {
      alert(
        `Your channel name must be at least ${MinChannelNameLength} characters long!`
      );
      return;
    }
    if (channelType === "PROTECTED" && password.length < MinPasswordLength) {
      alert(
        `Your password must be at least ${MinPasswordLength} characters long!`
      );
      return;
    }
    if (image === null) {
      alert(`Please choose a picture for the channel!`);
      return;
    }
    setDisplayChannelInvitor(!displayChannelInvitor);
  };
  return (
    <div className={style.create_channel}>
      <h3>Create Channel :</h3>
      <div className={style.create_channel__image}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          width="30px"
          height="30px"
        />
        {
          <img
            onClick={handleClickUpload}
            src={
              image
                ? URL.createObjectURL(image.get("file") as Blob)
                : UploadChannelIcon.src
            }
            alt="Selected"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
            }}
          />
        }

        <label>Choose a picture to the channel</label>
      </div>
      <div className={style.create_channel__name}>
        <label>Channel name :</label>
        <input
          value={channelName}
          type="text"
          onChange={handleChannelNameChange}
          placeholder="Type in the channel name ..."
          maxLength={MaxChannelNameLength}
        />
        {channelName && channelName.length < MinChannelNameLength && (
          <p className={style.create_channel_warning_message}>
            Your channel name must be at least {MinChannelNameLength} characters
            long!
          </p>
        )}
      </div>
      <div className={style.create_channel__select}>
        <label>Choose the type of the channel :</label>
        <select value={channelType} onChange={handleSelection}>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
          <option value="PROTECTED">Protected</option>
        </select>
      </div>
      {channelType === "PROTECTED" && (
        <>
          <label>Channel password :</label>
          <div className={style.create_channel__password}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {password && password.length < MinPasswordLength && (
              <p className={style.create_channel_warning_message}>
                Your password must be at least {MinPasswordLength} characters
                long!
              </p>
            )}
          </div>
        </>
      )}

      <div className={style.create_channel__button}>
        <button onClick={handleInviteUsersModal}>
          Add Members And Create Channel
        </button>
      </div>
      {displayChannelInvitor && (
        <ChannelInvitor
          userCondidates={condidateUsers}
          handleVisibility={handleInviteUsersModal}
          onConfirm={handleSubmitData}
        />
      )}
    </div>
  );
}
