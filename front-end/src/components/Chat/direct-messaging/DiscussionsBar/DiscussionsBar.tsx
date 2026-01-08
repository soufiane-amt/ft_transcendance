"use client";
import { useEffect, useState } from "react";
import style from "../../../../styles/ChatStyles/DiscussionsBar.module.css";
// import { DiscussionPanel } from "./DiscussionPanel/DiscussionPanel";
import {
  DiscussionDto,
  discussionPanelSelectType,
} from "../../interfaces/DiscussionPanel";
import { fetchDataFromApi } from "../../CustomFetch/fetchDataFromApi";
import socket from "../../../../app/socket/socket";
import { useRouter } from "next/navigation";
import { ChannelData } from "../../interfaces/ChannelData";
import { useHandlePanel } from "@/CustomHooks/useHandlePanel";
import { useHandleJoinDm } from "@/CustomHooks/useHandleJoinChannel";
import DiscussionPanel from "../../shared/DiscussionPanel/DiscussionPanel";
import {
  useChannelBooks,
  useFindChannelBook,
} from "@/app/context/ChannelInfoBook"; // adjust import as needed
import {
  useFindUserContacts,
  useUserContacts,
} from "@/app/context/UsersContactBookContext";

interface DiscussionsBarProps {
  openBar: boolean;
  selectedDiscussionState: {
    selectedDiscussion: discussionPanelSelectType;
    selectDiscussion: (e: discussionPanelSelectType) => void;
  };
  currentRoute: "Direct_messaging" | "Channels";
  discussionIsEmptyState: {
    discussionIsEmpty: boolean;
    setDiscussionIsEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export function DiscussionsBar({
  openBar,
  selectedDiscussionState,
  currentRoute,
  discussionIsEmptyState,
}: DiscussionsBarProps) {
  const [discussions, setDiscussions] = useState<DiscussionDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { selectedDiscussion, selectDiscussion } = selectedDiscussionState;
  const router = useRouter();

  const [channelData, setChannelData] = useState<Map<string, ChannelData>>(
    new Map()
  );
  const { setDiscussionIsEmpty } = discussionIsEmptyState;
  const channelBook = useChannelBooks();
  const userContacts = useUserContacts();

  const isChannels = currentRoute === "Channels";

  console.log("Current Route in DiscussionsBar:", currentRoute);
  useEffect(() => {
    async function fetchDiscussions() {
      setIsLoading(true);
      try {
        const fetchedData = await fetchDataFromApi(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/${currentRoute}/discussionsBar`
        );
        if (fetchedData.length === 0) setDiscussionIsEmpty(true);
        if (!isChannels) {
          setDiscussions(fetchedData);
          console.log("Fetched DMs:", fetchedData);
        } else {
          const room_data: DiscussionDto[] = fetchedData?.map(
            (item: DiscussionDto) => {
              return {
                id: item.id,
                partner_id: item.partner_id,
                last_message: item.last_message,
                unread_messages: item.unread_messages,
              };
            }
          );
          setDiscussions(() => room_data);
          const tmpMap = new Map();
          fetchedData.map((channel: any) => {
            tmpMap.set(channel.id, {
              channelUsers: channel.channelUsers,
              channelOwner: channel.channelOwner,
              channelAdmins: channel.channelAdmins,
              channelBans: channel.channelBans,
              channelMutes: channel.channelMutes,
            });
          });
          setChannelData(() => tmpMap);
        }
      } catch (error) {
        console.error("Failed to fetch discussions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDiscussions();
  }, [currentRoute]);

  useEffect(() => {
    const handleNewChannelUpdate = (
      channel_id: string,
      channelNewData: ChannelData
    ) => {
      const tmpMap = new Map(channelData);
      tmpMap.delete(channel_id);
      tmpMap.set(channel_id, channelNewData);
      setChannelData(() => tmpMap);
    };
    socket.on("updateChannelData", handleNewChannelUpdate);
  }, [channelData]);

  // Filter discussions by channel name using useFindChannelBook

  const filteredDiscussions = discussions.filter((d) => {
    if (isChannels) {
      const channel = channelBook.get(d.id);
      return channel?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const user = userContacts.get(d.partner_id);
      return user?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });
  useHandleJoinDm(selectedDiscussion);

  useHandlePanel(
    currentRoute,
    discussions,
    selectedDiscussionState,
    setDiscussions
  );

  const handleCreateNew = () => {
    router.push("/chat");
  };

  const handlePanelClick = async (panelData: DiscussionDto) => {
    selectDiscussion(panelData);
    console.log("Selected Discussion:", panelData);
    const updatedRooms = [...discussions];

    const indexToModify = updatedRooms.findIndex(
      (item) => item.id === panelData.id
    );
    if (indexToModify !== -1) {
      updatedRooms[indexToModify].unread_messages = 0;
      setDiscussions(updatedRooms);
    }
  };

  return (
    <div className={style.discussions_bar}>
      {/* Header */}
      <div className={style.header}>
        <div className={style.header_content}>
          <div className={style.header_icon}>
            {isChannels ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            )}
          </div>
          <div className={style.header_text}>
            <h2>{isChannels ? "Channels" : "Messages"}</h2>
            <span className={style.discussion_count}>
              {discussions.length} {isChannels ? "channels" : "conversations"}
            </span>
          </div>
        </div>
        <button
          className={style.create_button}
          onClick={handleCreateNew}
          title={isChannels ? "Create Channel" : "New Message"}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
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
            placeholder={
              isChannels ? "Search channels..." : "Search messages..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={style.search_input}
          />
          {searchQuery && (
            <button
              className={style.clear_search}
              onClick={() => setSearchQuery("")}
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
          )}
        </div>
      </div>

      {/* Discussions list */}
      <div className={style.discussions_list}>
        {isLoading ? (
          <div className={style.loading_state}>
            <div className={style.loading_spinner}></div>
            <p>Loading {isChannels ? "channels" : "conversations"}...</p>
          </div>
        ) : discussions.length > 0 ? (
          filteredDiscussions.map((panelElement) => {
            const isSelected = panelElement?.id === selectedDiscussion.id;

            return (
              <DiscussionPanel
                key={panelElement.id}
                channelId={panelElement.id}
                onSelect={handlePanelClick}
                DiscussionPanel={panelElement}
                selectedDiscussion={selectedDiscussion}
                isSelected={isSelected}
                currentRoute={currentRoute}
                channelData={channelData.get(panelElement.id)}
              />
            );
          })
        ) : searchQuery ? (
          <div className={style.empty_state}>
            <div className={style.empty_icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3>No results found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className={style.empty_state}>
            <div className={style.empty_icon}>
              {isChannels ? (
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
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              )}
            </div>
            <h3>No {isChannels ? "channels" : "conversations"} yet</h3>
            <p>
              {isChannels
                ? "Create or join a channel to start chatting"
                : "Start a conversation with someone"}
            </p>
            <button className={style.empty_action} onClick={handleCreateNew}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {isChannels ? "Create Channel" : "Start Conversation"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
