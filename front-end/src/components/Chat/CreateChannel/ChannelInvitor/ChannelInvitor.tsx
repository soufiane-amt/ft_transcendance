"use client";
import { useState } from "react";
import style from "../../../../styles/ChatStyles/ChannelInvitor.module.css";

interface ChannelInvitorProps {
  userCondidates: Map<string, string>;
  handleVisibility: () => void;
  onConfirm: (invitedUsers: string[]) => void;
  channelName?: string;
}

export function ChannelInvitor({
  userCondidates,
  handleVisibility,
  onConfirm,
  channelName = "Channel",
}: ChannelInvitorProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleUser = (username: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(username)) {
      newSelected.delete(username);
    } else {
      newSelected.add(username);
    }
    setSelectedUsers(newSelected);
  };

  const handleConfirm = () => {
    setIsCreating(true);

    // Call the onConfirm callback
    onConfirm(Array.from(selectedUsers));

    // Show success state after a brief delay
    setTimeout(() => {
      setIsCreating(false);
      setIsSuccess(true);

      // Auto close after showing success
      setTimeout(() => {
        handleVisibility();
      }, 2000);
    }, 800);
  };

  const filteredUsers = Array.from(userCondidates.entries()).filter(
    ([username]) => username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Success State
  if (isSuccess) {
    return (
      <div className={style.overlay}>
        <div className={`${style.modal} ${style.success_modal}`}>
          <div className={style.success_content}>
            <div className={style.success_icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={style.success_title}>Channel Created!</h3>
            <p className={style.success_message}>
              <strong>{channelName}</strong> has been created successfully
              {selectedUsers.size > 0 && (
                <>
                  <br />
                  <span className={style.invite_count}>
                    {selectedUsers.size} member
                    {selectedUsers.size > 1 ? "s" : ""} invited
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.overlay} onClick={handleVisibility}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={style.modal_header}>
          <div className={style.header_content}>
            <div className={style.header_icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3>Invite Members</h3>
              <p>Select users to invite to your channel</p>
            </div>
          </div>
          <button className={style.close_button} onClick={handleVisibility}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className={style.search_section}>
          <div className={style.search_wrapper}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isCreating}
            />
          </div>
          {selectedUsers.size > 0 && (
            <div className={style.selected_count}>
              {selectedUsers.size} selected
            </div>
          )}
        </div>

        {/* User list */}
        <div
          className={`${style.users_list} ${
            isCreating ? style.disabled : ""
          }`}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map(([username, avatar]) => (
              <div
                key={username}
                className={`${style.user_item} ${
                  selectedUsers.has(username) ? style.selected : ""
                }`}
                onClick={() => !isCreating && toggleUser(username)}
              >
                <div className={style.user_avatar}>
                  <img
                    src={avatar || "https://www.gravatar.com/avatar/?d=mp"}
                    alt={username}
                  />
                </div>
                <span className={style.user_name}>{username}</span>
                <div className={style.checkbox}>
                  {selectedUsers.has(username) && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={style.empty_state}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <p>No users found</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={style.modal_actions}>
          <button
            className={style.skip_button}
            onClick={handleConfirm}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Skip for now"}
          </button>
          <button
            className={style.confirm_button}
            onClick={handleConfirm}
            disabled={isCreating}
          >
            {isCreating ? (
              <div className={style.button_loading}>
                <div className={style.spinner}></div>
                <span>Creating Channel...</span>
              </div>
            ) : (
              <>
                <span>
                  {selectedUsers.size > 0
                    ? `Invite ${selectedUsers.size} & Create`
                    : "Create Channel"}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
