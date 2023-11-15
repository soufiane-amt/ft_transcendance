"use client";
import React, { useEffect, useRef, useState } from "react";
import style from "../../../styles/ChatStyles/DirectMsgMain.module.css";
import { discussionPanelSelectType } from "../interfaces/DiscussionPanel";

import { UserContactsProvider } from "../../../app/context/UsersContactBookContext";
import { BanProvider } from "../../../app/context/BanContext";
import { DiscussionsBar } from "./DiscussionsBar/DiscussionsBar";
import { ChattingField } from "./ChattingField/ChattingField";
import EmptyDiscussionMode from "../shared/EmptyMode/EmptyMode";

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
    const [discussionIsEmpty, setDiscussionIsEmpty] = useState<boolean>(false);

    const [openBar, setOpenBar] = useState(true);
    const handleOpenBar = () => {
      setOpenBar(!openBar);
    }

    const selectState = {
      selectedDiscussion,
      selectDiscussion,
    };
    return (
    <UserContactsProvider currentRoute="direct_messaging">
      <BanProvider currentRoute="direct_messaging">
        { !discussionIsEmpty && (
        
        <div className={style.direct_msg_main}>
          {
            // openBar && (
              <DiscussionsBar
                openBar={openBar}
                selectedDiscussionState={selectState}
                currentRoute={"Direct_messaging"}
                discussionIsEmptyState={{ discussionIsEmpty, setDiscussionIsEmpty }}

              />
            // )
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
        </div>)}
        {discussionIsEmpty && <EmptyDiscussionMode
              selectedDiscussion={selectedDiscussion}
               currentRoute={"Direct_messaging"}
               setDiscussionIsEmpty={setDiscussionIsEmpty}
               />}

      </BanProvider>
    </UserContactsProvider>
  );
}

export default DirectMesgMain;
