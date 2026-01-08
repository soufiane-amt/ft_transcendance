"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "../../../../styles/ChatStyles/ChatTextbox.module.css";
import { useSessionUser } from "../../../../app/context/SessionUserContext";
import { discussionPanelSelectType } from "../../interfaces/DiscussionPanel";
import socket from "../../../../app/socket/socket";
import { useBanContext } from "../../../../app/context/BanContext";
import { useHandleNewMsg } from "../../../../CustomHooks/useHandleNewMsg";
import {
  useHandleBan,
  useHandleUnBan,
} from "../../../../CustomHooks/useHandleBan";
import { useMuteContext } from "../../../../app/context/MuteContext";
import {
  useHandleMute,
  useHandleUnMute,
} from "../../../../CustomHooks/useHandleMute";
import { useHandleChattingDisable } from "../../../../CustomHooks/useHandleChattingDisable";

const isMessageValid = (message: string) => {
  return message.trim() !== "";
};

interface ChatTextBoxProps {
  selectedDiscussion: discussionPanelSelectType;
  messagesHistoryState: [
    messageDto[],
    React.Dispatch<React.SetStateAction<messageDto[]>>
  ];
}

function ChatTextBox({
  selectedDiscussion,
  messagesHistoryState,
}: ChatTextBoxProps) {
  const userSession = useSessionUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [newMessageContent, setNewMessageContent] = useState<string>("");
  const [isChatTextBoxDisabled, setIsChatTextBoxDisabled] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const BanContext = useBanContext();
  const MuteContext = useMuteContext();

  useHandleNewMsg(messagesHistoryState, selectedDiscussion);
  useHandleBan(BanContext, selectedDiscussion, setIsChatTextBoxDisabled);
  useHandleUnBan(BanContext, selectedDiscussion, setIsChatTextBoxDisabled);
  useHandleMute(MuteContext, selectedDiscussion, setIsChatTextBoxDisabled);
  useHandleUnMute(MuteContext, selectedDiscussion, setIsChatTextBoxDisabled);
  useHandleChattingDisable(
    BanContext,
    MuteContext,
    selectedDiscussion,
    setIsChatTextBoxDisabled
  );

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [newMessageContent]);

  const handleSendMessage = () => {
    if (!isMessageValid(newMessageContent)) return;

    const newMessage = {
      user_id: userSession.id,
      content: newMessageContent,
      channel_id: selectedDiscussion.id,
      dm_id: selectedDiscussion.id,
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendMsg", newMessage);
    setNewMessageContent("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessageContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const quickEmojis = ["😊", "👍", "❤️", "😂", "🎉", "🔥"];

  if (!selectedDiscussion.id) return null;

  if (isChatTextBoxDisabled) {
    return (
      <div className={style.textbox_container}>
        <div className={style.disabled_state}>
          <div className={style.disabled_icon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <div className={style.disabled_text}>
            <span>You can&apos;t send messages</span>
            <p>You have been restricted from this conversation</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.textbox_container}>
      {/* Quick emoji bar */}
      {showEmojiPicker && (
        <div className={style.emoji_picker}>
          <div className={style.emoji_header}>
            <span>Quick Reactions</span>
            <button
              className={style.emoji_close}
              onClick={() => setShowEmojiPicker(false)}
            >
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
          <div className={style.emoji_grid}>
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                className={style.emoji_btn}
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main input area */}
      <div
        className={`${style.input_wrapper} ${
          isFocused ? style.input_wrapper_focused : ""
        }`}
      >
        {/* Text input */}
        <div className={style.input_container}>
          <textarea
            ref={textareaRef}
            className={style.text_input}
            placeholder="Type a message..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
          />
        </div>

        {/* Emoji button */}
        <button
          className={`${style.action_button} ${
            showEmojiPicker ? style.action_button_active : ""
          }`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Add emoji"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Send button */}
        <button
          className={`${style.send_button} ${
            isMessageValid(newMessageContent) ? style.send_button_active : ""
          }`}
          onClick={handleSendMessage}
          disabled={!isMessageValid(newMessageContent)}
          title="Send message"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Hint text */}
      <div className={style.hint_text}>
        Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
      </div>
    </div>
  );
}

export default ChatTextBox;
