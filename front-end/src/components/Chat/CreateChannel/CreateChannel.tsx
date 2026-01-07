"use client";
import { useEffect, useRef, useState } from "react";
import style from "../../../styles/ChatStyles/CreateChannel.module.css";
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
  const [displayChannelInvitor, setDisplayChannelInvitor] = useState<boolean>(false);
  const [image, setImage] = useState<FormData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const jwtToken = Cookies.get("access_token");

  const setDataToDefault = () => {
    setChannelName("");
    setPassword("");
    setChannelType("PUBLIC");
    setImage(null);
    setImagePreview(null);
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

  const handleSubmitData = async (invitedUsers: string[]) => {
    if (!image) {
      alert("Please choose a picture for the channel!");
      return;
    }

    if (channelName.length < MinChannelNameLength) {
      alert(`Your channel name must be at least ${MinChannelNameLength} characters long!`);
      return;
    }

    if (channelType === "PROTECTED" && password.length < MinPasswordLength) {
      alert(`Your password must be at least ${MinPasswordLength} characters long!`);
      return;
    }

    setIsSubmitting(true);
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/upload`, image, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          socket.emit("createChannel", {
            channelName,
            imageSrc: res.data.imageSrc,
            channelType,
            password,
            invitedUsers,
          });
          setDataToDefault();
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleImageChange = (event: any) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.type && selectedFile.type.includes("image")) {
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);
        setImage(formData);
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        alert("Please choose a valid image file.");
        event.target.value = null;
      }
    }
  };

  const handleChannelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.length <= MaxChannelNameLength && inputText[inputText.length - 1] !== " ") {
      setChannelName(inputText);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.length <= MaxPasswordLength && inputText[inputText.length - 1] !== " ") {
      setPassword(inputText);
    }
  };


  const handleClickUpload = () => {
    fileInputRef.current!.click();
  };

  const handleInviteUsersModal = () => {
    if (channelName.length < MinChannelNameLength) {
      alert(`Your channel name must be at least ${MinChannelNameLength} characters long!`);
      return;
    }
    if (channelType === "PROTECTED" && password.length < MinPasswordLength) {
      alert(`Your password must be at least ${MinPasswordLength} characters long!`);
      return;
    }
    if (image === null) {
      alert(`Please choose a picture for the channel!`);
      return;
    }
    setDisplayChannelInvitor(!displayChannelInvitor);
  };

  const getTypeIcon = () => {
    switch (channelType) {
      case "PRIVATE":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case "PROTECTED":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
    }
  };

  return (
    <div className={style.create_channel_wrapper}>
      {/* Background decorations */}
      <div className={style.bg_circle_1}></div>
      <div className={style.bg_circle_2}></div>

      <div className={style.create_channel}>
        {/* Header */}
        <div className={style.header}>
          <div className={style.header_icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="9" y1="10" x2="15" y2="10" />
              <line x1="12" y1="7" x2="12" y2="13" />
            </svg>
          </div>
          <div className={style.header_text}>
            <h2>Create a New Channel</h2>
            <p>Set up your channel and invite members</p>
          </div>
        </div>

        {/* Image upload section */}
        <div className={style.image_section}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <div
            className={`${style.image_upload} ${imagePreview ? style.has_image : ""}`}
            onClick={handleClickUpload}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Channel preview" className={style.preview_image} />
            ) : (
              <div className={style.upload_placeholder}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Upload Image</span>
              </div>
            )}
            <div className={style.upload_overlay}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Change Image</span>
            </div>
          </div>
          <p className={style.image_hint}>Click to upload a channel image</p>
        </div>

        {/* Form fields */}
        <div className={style.form_section}>
          {/* Channel name */}
          <div className={style.input_group}>
            <label className={style.input_label}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
              </svg>
              Channel Name
            </label>
            <div className={style.input_wrapper}>
              <input
                type="text"
                value={channelName}
                onChange={handleChannelNameChange}
                placeholder="Enter channel name..."
                maxLength={MaxChannelNameLength}
                className={style.text_input}
              />
              <span className={style.char_count}>
                {channelName.length}/{MaxChannelNameLength}
              </span>
            </div>
            {channelName && channelName.length < MinChannelNameLength && (
              <p className={style.warning_message}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Channel name must be at least {MinChannelNameLength} characters
              </p>
            )}
          </div>

          {/* Channel type */}
          <div className={style.input_group}>
            <label className={style.input_label}>
              {getTypeIcon()}
              Channel Type
            </label>
            <div className={style.type_selector}>
              <button
                type="button"
                className={`${style.type_option} ${channelType === "PUBLIC" ? style.active : ""}`}
                onClick={() => setChannelType("PUBLIC")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Public</span>
                <small>Anyone can join</small>
              </button>
              <button
                type="button"
                className={`${style.type_option} ${channelType === "PRIVATE" ? style.active : ""}`}
                onClick={() => setChannelType("PRIVATE")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Private</span>
                <small>Invite only</small>
              </button>
              <button
                type="button"
                className={`${style.type_option} ${channelType === "PROTECTED" ? style.active : ""}`}
                onClick={() => setChannelType("PROTECTED")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Protected</span>
                <small>Password required</small>
              </button>
            </div>
          </div>

          {/* Password field (conditional) */}
          {channelType === "PROTECTED" && (
            <div className={`${style.input_group} ${style.password_group}`}>
              <label className={style.input_label}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Channel Password
              </label>
              <div className={style.input_wrapper}>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a secure password..."
                  maxLength={MaxPasswordLength}
                  className={style.text_input}
                />
              </div>
              {password && password.length < MinPasswordLength && (
                <p className={style.warning_message}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Password must be at least {MinPasswordLength} characters
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className={style.action_section}>
          <button
            className={style.submit_button}
            onClick={handleInviteUsersModal}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className={style.spinner}></div>
            ) : (
              <>
                <span>Continue to Invite Members</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
          <p className={style.action_hint}>You can invite members in the next step</p>
        </div>
      </div>

      {/* Channel Invitor Modal */}
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
