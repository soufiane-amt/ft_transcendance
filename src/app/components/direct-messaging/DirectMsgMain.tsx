"use client";
import React, { useEffect, useRef, useState } from "react";
import style from "./DirectMsgMain.module.css";
import { discussionPanelSelectType } from "../../interfaces/DiscussionPanel";

import { UserContactsProvider } from "../../context/UsersContactBookContext";
import { BanProvider } from "../../context/BanContext";
import { DiscussionsBar } from "./DiscussionsBar/DiscussionsBar";
import { ChattingField } from "./ChattingField/ChattingField";

/*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */
export const selectedPanelDefault: discussionPanelSelectType = {
  id: "",
  partner_id: "",
};


function DirectMesgMain() {
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
    <UserContactsProvider currentRoute="direct_messaging">
      <BanProvider>
        <div className={style.direct_msg_main}>
          <DiscussionsBar
            selectedDiscussionState={selectState}
            currentRoute={"Direct_messaging"}
          />
          <ChattingField
            selectDiscussionState={selectState}
          />
        </div>

      </BanProvider>
    </UserContactsProvider>
  );
}

export default DirectMesgMain;
