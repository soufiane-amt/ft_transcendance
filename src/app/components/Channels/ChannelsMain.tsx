"use client";
import React, { useEffect, useRef, useState } from "react";
import style from "./ChannelsMain.module.css";
import { discussionPanelSelectType } from "../../interfaces/DiscussionPanel";

  import { DiscussionsBar } from "../direct-messaging/DiscussionsBar/DiscussionsBar";
import { ChattingField } from "../direct-messaging/ChattingField/ChattingField";
import { BanProvider } from "../../context/BanContext";

/*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */
export const selectedPanelDefault: discussionPanelSelectType = {
  id: "",
  partner_id: "",
};


function ChannelsMain() {
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<discussionPanelSelectType>(selectedPanelDefault);
    
    const selectDiscussion = (e : discussionPanelSelectType) => {
      setSelectedDiscussion(e);
    };
    const selectState = {
      selectedDiscussion,
      selectDiscussion,
    };
    return (
        <div className={style.direct_msg_main}>
            <BanProvider>
                  <DiscussionsBar
                    selectedDiscussionState={selectState}
                    />
                  <ChattingField
                    selectDiscussionState={selectState}
                    />
            </BanProvider>
        </div>

  );
}

export default ChannelsMain;
