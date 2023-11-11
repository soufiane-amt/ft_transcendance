"use client";
import React, { useEffect, useRef, useState } from "react";
import style from "./ChannelsMain.module.css";
import { discussionPanelSelectType } from "../../interfaces/DiscussionPanel";

import { BanProvider } from "../../context/BanContext";
import { UserContactsProvider } from "../../context/UsersContactBookContext";
import { ChannelBooksProvider } from "../../context/ChannelInfoBook";
import { DiscussionsBar } from "../direct-messaging/DiscussionsBar/DiscussionsBar";
import { ChattingField } from "../direct-messaging/ChattingField/ChattingField";
import { MuteProvider } from "../../context/MuteContext";
import EmptyDiscussionMode from "../shared/EmptyMode/EmptyMode";


/*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */
export const selectedPanelDefault: discussionPanelSelectType = {
  id: "",
  partner_id: "",
};



function ChannelsMain() {
  const [selectedDiscussion, setSelectedDiscussion] =
        useState<discussionPanelSelectType>(selectedPanelDefault);
  const [discussionIsEmpty, setDiscussionIsEmpty] = useState<boolean>(false);

  
  
  const selectDiscussion = (e : discussionPanelSelectType) => {
      setSelectedDiscussion(e);
    };

    const [openBar, setOpenBar] = useState(true);
    const handleOpenBar = () => {
      setOpenBar(!openBar);
    }
    const selectState = {
      selectedDiscussion,
      selectDiscussion,
    };
    return (
      <UserContactsProvider currentRoute="channels">
        <ChannelBooksProvider>
          <BanProvider currentRoute="Channels">
              <MuteProvider currentRoute="Channels">
                { !discussionIsEmpty && (
                <div className={style.channel_main}>
                {
                  openBar && (

                      <DiscussionsBar
                        selectedDiscussionState={selectState}
                        currentRoute={"Channels"}
                        discussionIsEmptyState={{ discussionIsEmpty, setDiscussionIsEmpty }}
                        />)
                }
                <ChattingField
                  openBar={openBar}
                  selectDiscussionState={selectState}
                />
                <button className={`${style.discussions_bar_swither} 
                      ${!openBar ? style.discussions_bar_swither_close : ''}`} 
                         onClick={handleOpenBar}>
                      {
                        openBar === true ? '<' : '>'
                      }
                </button> 

                </div>
                )}
                {discussionIsEmpty && <EmptyDiscussionMode
                selectedDiscussion={selectedDiscussion}
                currentRoute={"Channels"} 
                setDiscussionIsEmpty={setDiscussionIsEmpty}
               />}
              </MuteProvider>
            </BanProvider>
        </ChannelBooksProvider>
      </UserContactsProvider>
  

  );
}
 

export default ChannelsMain;
