"use client";
import { useEffect, useState } from "react";
import { ChannelJoin } from "./ChannelJoin/ChannelJoin";
import { UserInitiativeTalk } from "./UserInitiativeTalk/UserInitiativeTalk";
import style from "../../../styles/ChatStyles/WelcomingPage.module.css";
import { fetchDataFromApi } from "../CustomFetch/fetchDataFromApi";

type DmType = { username: string; avatar: string };
export type ChannelType = {
  id: string;
  name: string;
  image: string;
  type: string;
};

interface dataToDisplayType {
  dmsToJoin: DmType[];
  channelsToJoin: ChannelType[];
}

export function WelcomingPage() {
  const [dataToDisplay, setDataToDisplay] = useState<dataToDisplayType>({
    dmsToJoin: [],
    channelsToJoin: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDataAsync() {
      try {
        const fetchedData = await fetchDataFromApi(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/channels_users_inits`
        );
        setDataToDisplay(fetchedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDataAsync();
  }, []);

  const hasUsers = dataToDisplay?.dmsToJoin?.length > 0;
  const hasChannels = dataToDisplay?.channelsToJoin?.length > 0;
  const hasContent = hasUsers || hasChannels;

  return (
    <div className={style.welcoming_page}>
      {/* Decorative background elements */}
      <div className={style.bg_gradient}></div>
      <div className={style.bg_circle_1}></div>
      <div className={style.bg_circle_2}></div>
      <div className={style.bg_circle_3}></div>

      {/* Header Section */}
      <header className={style.header}>
        <div className={style.header_icon}>
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 4C16.536 4 4 14.536 4 28c0 6.5 2.8 12.4 7.4 16.8L8 56l14.4-7.2c3 1 6.2 1.6 9.6 1.6 15.464 0 28-10.536 28-24S47.464 4 32 4z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="20"
              cy="28"
              r="3"
              fill="currentColor"
              className={style.dot_1}
            />
            <circle
              cx="32"
              cy="28"
              r="3"
              fill="currentColor"
              className={style.dot_2}
            />
            <circle
              cx="44"
              cy="28"
              r="3"
              fill="currentColor"
              className={style.dot_3}
            />
          </svg>
        </div>
        <h1 className={style.header_title}>Welcome to Chat Space</h1>
        <p className={style.header_subtitle}>
          Connect with friends, join channels, and start meaningful
          conversations
        </p>
      </header>

      {/* Main Content */}
      <main className={style.main_content}>
        {isLoading ? (
          <div className={style.loading_container}>
            <div className={style.loading_spinner}></div>
            <p className={style.loading_text}>Loading your connections...</p>
          </div>
        ) : hasContent ? (
          <div
            className={`${style.cards_container} ${
              hasUsers && hasChannels ? style.two_columns : ""
            }`}
          >
            {/* Users Section */}
            {hasUsers && (
              <section className={style.card}>
                <div className={style.card_header}>
                  <div className={style.card_icon}>
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
                  <div className={style.card_header_text}>
                    <h2 className={style.card_title}>Start a Conversation</h2>
                    <p className={style.card_count}>
                      {dataToDisplay.dmsToJoin.length} users available
                    </p>
                  </div>
                </div>
                <div className={style.card_content}>
                  {dataToDisplay.dmsToJoin.map((user) => (
                    <UserInitiativeTalk
                      key={"user_" + user.username}
                      userData={{
                        username: user.username,
                        avatar: user.avatar,
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Channels Section */}
            {hasChannels && (
              <section className={style.card}>
                <div className={style.card_header}>
                  <div className={style.card_icon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <line x1="9" y1="10" x2="15" y2="10" />
                      <line x1="12" y1="7" x2="12" y2="13" />
                    </svg>
                  </div>
                  <div className={style.card_header_text}>
                    <h2 className={style.card_title}>Join a Channel</h2>
                    <p className={style.card_count}>
                      {dataToDisplay.channelsToJoin.length} channels available
                    </p>
                  </div>
                </div>
                <div className={style.card_content}>
                  {dataToDisplay.channelsToJoin.map((channel: ChannelType) => (
                    <ChannelJoin
                      key={"channel_" + channel.id}
                      channelData={channel}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className={style.empty_state}>
            <div className={style.empty_icon}>
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M32 20v8M32 36v8M24 28h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className={style.empty_title}>No Conversations Yet</h2>
            <p className={style.empty_description}>
              There are no users or channels available to join right now. Check
              back later or create your own channel!
            </p>
            <a href="/chat/CreateChannel" className={style.empty_button}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Channel
            </a>
          </div>
        )}
      </main>

      {/* Quick Actions Footer */}
      {hasContent && (
        <footer className={style.footer}>
          <div className={style.footer_tip}>
            <span className={style.tip_icon}>💡</span>
            <span className={style.tip_text}>
              Click on a user or channel to start chatting instantly
            </span>
          </div>
          <a href="/chat/CreateChannel" className={style.footer_action}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create New Channel
          </a>
        </footer>
      )}
    </div>
  );
}
