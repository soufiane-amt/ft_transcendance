"use client";
import React, { useState } from "react";
import style from "../../../styles/ChatStyles/ChannelsMain.module.css";
import { discussionPanelSelectType } from "../interfaces/DiscussionPanel";

import { BanProvider } from "../../../app/context/BanContext";
import { UserContactsProvider } from "../../../app/context/UsersContactBookContext";
import { ChannelBooksProvider } from "../../../app/context/ChannelInfoBook";
import { DiscussionsBar } from "../direct-messaging/DiscussionsBar/DiscussionsBar";
import { ChattingField } from "../direct-messaging/ChattingField/ChattingField";
import { MuteProvider } from "../../../app/context/MuteContext";

/*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */
export const selectedPanelDefault: discussionPanelSelectType = {
  id: "",
  partner_id: "",
};

function ChannelsMain() {
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<discussionPanelSelectType>(selectedPanelDefault);
  const [discussionIsEmpty, setDiscussionIsEmpty] = useState<boolean>(false);

  const selectDiscussion = (e: discussionPanelSelectType) => {
    setSelectedDiscussion(e);
  };

  const [openBar, setOpenBar] = useState(true);
  const handleOpenBar = () => {
    setOpenBar(!openBar);
  };

  const selectState = {
    selectedDiscussion,
    selectDiscussion,
  };

  return (
    <UserContactsProvider currentRoute="channels">
      <ChannelBooksProvider>
        <BanProvider currentRoute="Channels">
          <MuteProvider currentRoute="Channels">
            <div className={style.channel_main}>
              {/* Background decorations */}
              <div className={style.bg_gradient}></div>
              <div className={style.bg_circle_1}></div>
              <div className={style.bg_circle_2}></div>

              <div className={style.chat_container}>
                {/* Discussions sidebar */}
                <aside
                  className={`${style.sidebar} ${
                    openBar ? style.sidebar_open : style.sidebar_closed
                  }`}
                >
                  <DiscussionsBar
                    openBar={openBar}
                    selectedDiscussionState={selectState}
                    currentRoute={"Channels"}
                    discussionIsEmptyState={{
                      discussionIsEmpty,
                      setDiscussionIsEmpty,
                    }}
                  />
                </aside>

                {/* Toggle button */}
                <button
                  className={`${style.toggle_button} ${
                    !openBar ? style.toggle_button_closed : ""
                  }`}
                  onClick={handleOpenBar}
                  aria-label={openBar ? "Close sidebar" : "Open sidebar"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${style.toggle_icon} ${
                      !openBar ? style.toggle_icon_flipped : ""
                    }`}
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Main chat area */}
                <main
                  className={`${style.chat_area} ${
                    !openBar ? style.chat_area_expanded : ""
                  }`}
                >
                  <ChattingField
                    openBar={openBar}
                    selectDiscussionState={selectState}
                    currentRoute={"Channels"}
                  />
                </main>
              </div>
            </div>
          </MuteProvider>
        </BanProvider>
      </ChannelBooksProvider>
    </UserContactsProvider>
  );
}

export default ChannelsMain;
