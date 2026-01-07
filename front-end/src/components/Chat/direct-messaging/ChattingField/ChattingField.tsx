"use client";
import { useEffect, useRef, useState } from "react";
import { discussionPanelSelectType } from "../../interfaces/DiscussionPanel";
import { fetchDataFromApi } from "../../CustomFetch/fetchDataFromApi";
import ChatTextBox from "../../shared/ChatTextbox/ChatTextbox";
import style from "../../../../styles/ChatStyles/ChattingField.module.css";
import Message from "../../shared/Message/Message";
import { selectedPanelDefault } from "../DirectMsgMain";
import { useFindUserContacts } from "../../../../app/context/UsersContactBookContext";
import { useFindChannelBook } from "../../../../app/context/ChannelInfoBook";

interface MessagesHistoryProps {
  messages: messageDto[];
  isLoading: boolean;
}

function MessagesHistory({ messages, isLoading }: MessagesHistoryProps) {
  const scrollDown = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollDown.current != null)
      scrollDown.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className={style.messages_container}>
        <div className={style.loading_state}>
          <div className={style.loading_spinner}></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={style.messages_container}>
        <div className={style.empty_state}>
          <div className={style.empty_icon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <h3>No messages yet</h3>
          <p>Start the conversation by sending a message below</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.messages_container}>
      <div className={style.messages_list}>
        {messages.map((messageElement: messageDto, index: number) => {
          const showDateSeparator = shouldShowDateSeparator(messages, index);
          return (
            <div key={messageElement.id}>
              {showDateSeparator && (
                <div className={style.date_separator}>
                  <span>{formatDateSeparator(messageElement.createdAt)}</span>
                </div>
              )}
              <Message messageData={messageElement} />
            </div>
          );
        })}
        <div className={style.scroll_anchor} ref={scrollDown}></div>
      </div>
    </div>
  );
}

// Helper function to determine if we should show a date separator
function shouldShowDateSeparator(
  messages: messageDto[],
  index: number
): boolean {
  if (index === 0) return true;
  const currentDate = new Date(messages[index].createdAt).toDateString();
  const previousDate = new Date(messages[index - 1].createdAt).toDateString();
  return currentDate !== previousDate;
}

// Helper function to format the date separator
function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }
}

interface EmptyChatStateProps {
  partnerName?: string;
  isChannel?: boolean;
}

function EmptyChatState({ partnerName, isChannel }: EmptyChatStateProps) {
  return (
    <div className={style.chat_field}>
      <div className={style.welcome_state}>
        <div className={style.welcome_icon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        </div>
        <h2>Select a conversation</h2>
        <p>
          Choose a {isChannel ? "channel" : "conversation"} from the sidebar to
          start chatting
        </p>
        {
          !isChannel && <p>Please make sure to have the users you want to connect with in the friends list.</p>
        }
        <div className={style.welcome_tips}>
          <div className={style.tip}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>Click on a chat to view messages</span>
          </div>
          <div className={style.tip}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Start a new conversation anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatHeaderProps {
  name: string;
  avatar: string;
  isOnline?: boolean;
  isChannel?: boolean;
  channelType?: string;
  memberCount?: number;
}

function ChatHeader({
  name,
  avatar,
  isOnline,
  isChannel,
  channelType,
  memberCount,
}: ChatHeaderProps) {
  return (
    <div className={style.chat_header}>
      <div className={style.header_info}>
        <div className={style.header_avatar}>
          <img
            src={avatar }
            alt={name}
          />
          {!isChannel && isOnline && <span className={style.online_dot}></span>}
          {isChannel && channelType && (
            <span
              className={`${style.channel_type_badge} ${
                style[`type_${channelType.toLowerCase()}`]
              }`}
            >
              {channelType === "PRIVATE" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ) : channelType === "PROTECTED" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                </svg>
              )}
            </span>
          )}
        </div>
        <div className={style.header_text}>
          <h3 className={style.header_name}>{name}</h3>
          <span className={style.header_status}>
            {isChannel
              ? memberCount
                ? `${memberCount} members`
                : "Channel"
              : isOnline
              ? "Online"
              : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ChattingFieldProps {
  openBar: boolean;
  selectDiscussionState: {
    selectedDiscussion: discussionPanelSelectType;
    selectDiscussion: (e: discussionPanelSelectType) => void;
  };
  currentRoute?: "Direct_messaging" | "Channels";
}

export function ChattingField({
  openBar,
  selectDiscussionState,
  currentRoute = "Direct_messaging",
}: ChattingFieldProps) {
  const { selectedDiscussion, selectDiscussion } = selectDiscussionState;
  const [messagesHistory, setMessageHistory] = useState<messageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isChannel = currentRoute === "Channels";
  const userContact = useFindUserContacts(selectedDiscussion.partner_id);
  const channelBook = useFindChannelBook(selectedDiscussion.id);
  const chatInfo = isChannel
    ? {
        name: channelBook?.name || "",
        avatar: channelBook?.avatar || "",
        type: channelBook?.type,
      }
    : { name: userContact?.username || "", avatar: userContact?.avatar || "" };

    console.log("ChattingField rendered with chatInfo:", chatInfo);
  useEffect(() => {
    async function fetchDataAsync() {
      if (selectedDiscussion.id) {
        setIsLoading(true);
        try {
          const messagesHistory_tmp = await fetchDataFromApi(
            `${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/${selectedDiscussion.id}/messages`
          );
          setMessageHistory(messagesHistory_tmp || []);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setMessageHistory([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessageHistory([]);
      }
    }
    if (selectedDiscussion !== selectedPanelDefault) {
      fetchDataAsync();
    }
  }, [selectedDiscussion]);

  // Show welcome state if no discussion selected
  if (!selectedDiscussion.id) {
    return <EmptyChatState isChannel={isChannel} />;
  }

  return (
    <div
      className={`${style.chat_field} ${
        !openBar ? style.chat_field_expanded : ""
      }`}
    >
      {/* Chat header */}
      <ChatHeader
        name={chatInfo.name}
        avatar={chatInfo.avatar}
        isOnline={true}
        isChannel={isChannel}
        channelType={chatInfo.type}
      />

      {/* Messages area */}
      <MessagesHistory messages={messagesHistory} isLoading={isLoading} />

      {/* Input area */}
      <div className={style.input_section}>
        <ChatTextBox
          selectedDiscussion={selectedDiscussion}
          messagesHistoryState={[messagesHistory, setMessageHistory]}
        />
      </div>
    </div>
  );
}
