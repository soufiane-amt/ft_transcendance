"use client";

import React, { useState } from "react";
import style from "../../../../styles/ChatStyles/ChannelSetting.module.css";
import { useFindChannelBook } from "../../../../app/context/ChannelInfoBook";
import socket from "../../../../app/socket/socket";

const MaxPasswordLength = 50;
const MinPasswordLength = 8;

// Icons
const Icons = {
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  lock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  chevronLeft: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
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
  hashtag: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
};

type ChannelType = "PUBLIC" | "PRIVATE" | "PROTECTED";

interface ChannelTypeOption {
  type: ChannelType;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const channelTypeOptions: ChannelTypeOption[] = [
  {
    type: "PUBLIC",
    icon: Icons.globe,
    label: "Public",
    description: "Anyone can find and join this channel",
    color: "success",
  },
  {
    type: "PRIVATE",
    icon: Icons.lock,
    label: "Private",
    description: "Only invited members can join",
    color: "primary",
  },
  {
    type: "PROTECTED",
    icon: Icons.shield,
    label: "Protected",
    description: "Requires password to join",
    color: "warning",
  },
];

interface ChannelSettingProps {
  channel_id: string;
  onBack?: () => void;
  onClose?: () => void;
}

export function ChannelSetting({ channel_id, onBack, onClose }: ChannelSettingProps) {
  const currentChannel = useFindChannelBook(channel_id);
  const [selectedType, setSelectedType] = useState<ChannelType>(
    (currentChannel?.type as ChannelType) || "PUBLIC"
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (type: ChannelType) => {
    setSelectedType(type);
    setError(null);
    if (type !== "PROTECTED") {
      setPassword("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.length <= MaxPasswordLength && !inputText.includes(" ")) {
      setPassword(inputText);
      setError(null);
    }
  };

  const getPasswordStrength = (): { level: string; color: string; width: string } => {
    if (password.length === 0) return { level: "", color: "", width: "0%" };
    if (password.length < MinPasswordLength)
      return { level: "Too short", color: "danger", width: "25%" };
    if (password.length < 12)
      return { level: "Weak", color: "warning", width: "50%" };
    if (password.length < 16)
      return { level: "Good", color: "primary", width: "75%" };
    return { level: "Strong", color: "success", width: "100%" };
  };

  const handleConfirmClick = () => {
    // Validation
    if (selectedType === "PROTECTED") {
      if (password.length < MinPasswordLength) {
        setError(`Password must be at least ${MinPasswordLength} characters long`);
        return;
      }
    }

    // Check if anything changed
    if (selectedType === currentChannel?.type && selectedType !== "PROTECTED") {
      setError("No changes detected");
      return;
    }

    setIsLoading(true);
    setError(null);

    socket.emit("updateChannelType", {
      channel_id,
      type: selectedType,
      password: selectedType === "PROTECTED" ? password : "",
    });

    // Simulate loading and close
    setTimeout(() => {
      setIsLoading(false);
      if (onClose) {
        onClose();
      } else {
        window.location.reload();
      }
    }, 500);
  };

  const passwordStrength = getPasswordStrength();
  const hasChanges =
    selectedType !== currentChannel?.type ||
    (selectedType === "PROTECTED" && password.length >= MinPasswordLength);

  if (!currentChannel) {
    return null;
  }

  return (
    <div className={style.settings_container}>
      {/* Header */}
      <div className={style.settings_header}>
        {onBack && (
          <button className={style.back_button} onClick={onBack}>
            {Icons.chevronLeft}
          </button>
        )}
        <div className={style.header_content}>
          <h3 className={style.header_title}>Channel Settings</h3>
          <p className={style.header_subtitle}>Configure your channel preferences</p>
        </div>
      </div>

      {/* Channel Preview */}
      <div className={style.channel_preview}>
        <div className={style.preview_avatar}>
          {currentChannel.avatar ? (
            <img src={currentChannel.avatar} alt={currentChannel.name} />
          ) : (
            <div className={style.preview_avatar_placeholder}>{Icons.hashtag}</div>
          )}
        </div>
        <div className={style.preview_info}>
          <span className={style.preview_name}>{currentChannel.name}</span>
          <span className={style.preview_type}>
            Currently: {currentChannel.type?.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Type Selection */}
      <div className={style.section}>
        <label className={style.section_label}>Channel Visibility</label>
        <div className={style.type_options}>
          {channelTypeOptions.map((option) => (
            <button
              key={option.type}
              className={`${style.type_option} ${
                selectedType === option.type ? style.type_option_selected : ""
              } ${style[`type_${option.color}`]}`}
              onClick={() => handleTypeSelect(option.type)}
            >
              <div className={`${style.type_icon} ${style[`icon_${option.color}`]}`}>
                {option.icon}
              </div>
              <div className={style.type_content}>
                <span className={style.type_label}>{option.label}</span>
                <span className={style.type_description}>{option.description}</span>
              </div>
              {selectedType === option.type && (
                <div className={`${style.type_check} ${style[`check_${option.color}`]}`}>
                  {Icons.check}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Password Section (only for PROTECTED) */}
      {selectedType === "PROTECTED" && (
        <div className={`${style.section} ${style.password_section}`}>
          <label className={style.section_label}>Channel Password</label>
          <div className={style.password_input_wrapper}>
            <input
              type={showPassword ? "text" : "password"}
              className={style.password_input}
              placeholder="Enter a secure password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={style.password_toggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? Icons.eyeOff : Icons.eye}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className={style.password_strength}>
              <div className={style.strength_bar}>
                <div
                  className={`${style.strength_fill} ${style[`strength_${passwordStrength.color}`]}`}
                  style={{ width: passwordStrength.width }}
                />
              </div>
              <span className={`${style.strength_label} ${style[passwordStrength.color]}`}>
                {passwordStrength.level}
              </span>
            </div>
          )}

          <p className={style.password_hint}>
            Password must be at least {MinPasswordLength} characters. No spaces allowed.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={style.error_message}>
          <span className={style.error_icon}>{Icons.warning}</span>
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className={style.action_buttons}>
        {onBack && (
          <button className={style.cancel_button} onClick={onBack} disabled={isLoading}>
            Cancel
          </button>
        )}
        <button
          className={`${style.confirm_button} ${!hasChanges ? style.confirm_disabled : ""}`}
          onClick={handleConfirmClick}
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? (
            <span className={style.loading_spinner} />
          ) : (
            <>
              <span>Save Changes</span>
              {Icons.check}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
