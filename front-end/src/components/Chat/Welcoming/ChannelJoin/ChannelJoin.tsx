"use client";

import { useState } from "react";
import style from "../../../../styles/ChatStyles/ChannelJoin.module.css";
import { ChannelType } from "../WelcomingPage";
import socket from "../../../../app/socket/socket";
import axios from "axios";
import Cookies from "js-cookie";

// Icons
const Icons = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  join: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  eye: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  warning: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  key: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
};

interface ChannelJoinProps {
  channelData: ChannelType;
}

export function ChannelJoin({ channelData }: ChannelJoinProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = Cookies.get("access_token");

  const handleJoin = async (channelPassword: string = "") => {
    setIsJoining(true);
    setError(null);

    const channelRequestMembership = {
      channel_id: channelData.id,
      password: channelPassword,
      type: channelData.type,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/channelJoinRequest`,
        channelRequestMembership,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        socket.emit("joinSignal", channelData.id);
        window.location.href = `/chat/Channels/`;
      }
    } catch (err: any) {
      setIsJoining(false);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Incorrect password. Please try again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to join channel. Please try again.");
      }
    }
  };

  const handleCardClick = () => {
    if (isJoining) return;

    if (channelData.type === "PROTECTED") {
      setShowPasswordModal(true);
      setPassword("");
      setError(null);
    } else if (channelData.type === "PUBLIC") {
      handleJoin();
    }
    // Private channels cannot be joined directly
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length === 0) {
      setError("Please enter a password");
      return;
    }
    handleJoin(password);
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword("");
    setError(null);
    setIsJoining(false);
  };

  const getChannelTypeIcon = () => {
    switch (channelData.type?.toUpperCase()) {
      case "PRIVATE":
        return Icons.lock;
      case "PROTECTED":
        return Icons.shield;
      default:
        return Icons.globe;
    }
  };

  const getChannelTypeLabel = () => {
    switch (channelData.type?.toUpperCase()) {
      case "PRIVATE":
        return "Private Channel";
      case "PROTECTED":
        return "Protected Channel";
      default:
        return "Public Channel";
    }
  };

  const getChannelTypeBadgeClass = () => {
    switch (channelData.type?.toUpperCase()) {
      case "PRIVATE":
        return style.badge_private;
      case "PROTECTED":
        return style.badge_protected;
      default:
        return style.badge_public;
    }
  };

  const getJoinButtonText = () => {
    if (isJoining) return null;
    switch (channelData.type?.toUpperCase()) {
      case "PRIVATE":
        return "Request Access";
      case "PROTECTED":
        return "Enter Password";
      default:
        return "Join";
    }
  };

  const isJoinable = channelData.type?.toUpperCase() !== "PRIVATE";

  return (
    <>
      <div
        className={`${style.channel_card} ${isHovered ? style.channel_card_hover : ""} ${!isJoinable ? style.channel_card_disabled : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={isJoinable ? handleCardClick : undefined}
      >
        {/* Channel image */}
        <div className={style.image_container}>
          <img
            src={channelData.image || "/default-channel.png"}
            alt={channelData.name}
            className={style.channel_image}
          />
          <div className={`${style.type_badge} ${getChannelTypeBadgeClass()}`}>
            {getChannelTypeIcon()}
          </div>
        </div>

        {/* Channel info */}
        <div className={style.channel_info}>
          <h3 className={style.channel_name}>{channelData.name}</h3>
          <div className={style.channel_meta}>
            <span className={style.channel_type}>{getChannelTypeLabel()}</span>
          </div>
        </div>

        {/* Join button */}
        <button
          className={`${style.join_button} ${isJoining ? style.joining : ""} ${!isJoinable ? style.disabled : ""}`}
          disabled={isJoining || !isJoinable}
        >
          {isJoining ? (
            <div className={style.spinner}></div>
          ) : (
            <>
              {channelData.type?.toUpperCase() === "PROTECTED" ? Icons.key : Icons.join}
              <span>{getJoinButtonText()}</span>
            </>
          )}
        </button>

        {/* Hover glow effect */}
        <div className={style.glow_effect}></div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className={style.modal_backdrop} onClick={handleCloseModal}>
          <div
            className={style.password_modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={style.modal_header}>
              <div className={style.modal_icon}>
                {Icons.shield}
              </div>
              <div className={style.modal_header_content}>
                <h3 className={style.modal_title}>Protected Channel</h3>
                <p className={style.modal_subtitle}>
                  Enter the password to join <strong>{channelData.name}</strong>
                </p>
              </div>
              <button
                className={style.modal_close}
                onClick={handleCloseModal}
                type="button"
              >
                {Icons.close}
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordSubmit} className={style.modal_body}>
              <div className={style.input_group}>
                <label className={style.input_label}>Channel Password</label>
                <div className={style.password_input_wrapper}>
                  <div className={style.input_icon}>
                    {Icons.key}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${style.password_input} ${error ? style.input_error : ""}`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    autoFocus
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className={style.password_toggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? Icons.eyeOff : Icons.eye}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={style.error_message}>
                    <span className={style.error_icon}>{Icons.warning}</span>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className={style.modal_actions}>
                <button
                  type="button"
                  className={style.cancel_button}
                  onClick={handleCloseModal}
                  disabled={isJoining}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={style.submit_button}
                  disabled={isJoining || password.trim().length === 0}
                >
                  {isJoining ? (
                    <div className={style.spinner_small}></div>
                  ) : (
                    <>
                      <span>Join Channel</span>
                      {Icons.join}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
