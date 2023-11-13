import React, { useEffect, useRef, useState } from "react";
import style from "../../../../styles/ChatStyles/DiscussionPanel.module.css"; // Import styles
import { DiscussionDto } from "../../interfaces/DiscussionPanel";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";
import { findUserContacts } from "../../../../app/context/UsersContactBookContext";
import socket from "../../../../app/socket/socket";
import clsx from "clsx";
import { findChannelBook } from "../../../../app/context/ChannelInfoBook";
import { useSessionUser } from "../../../../app/context/SessionUserContext";

const findDiscussions = (
  currentRoute : "Direct_messaging" | "Channels",
  partner_id: string | undefined,
  discussion_id: string //This id is either the id of channel or the id of the user to dm
) => {
  if (currentRoute === "Direct_messaging") {
      if (partner_id !== undefined) {
        const discussion_data = findUserContacts(partner_id);
        console.log('discussion_data:', partner_id)
        if (!discussion_data) return undefined;
        return {
          name: discussion_data.username,
          avatar: discussion_data.avatar,
          };
        }
        else{
          const discussion_data = useSessionUser();
          if (!discussion_data) return undefined;
          return {
            name: discussion_data.username,
            avatar: discussion_data.avatar,
          };
        } 
    }
  else {
    const discussion_data = findChannelBook(discussion_id);
    if (!discussion_data) return undefined;
    return {
      name: discussion_data.name,
      avatar: discussion_data.avatar,
      type: discussion_data.type,
    };
  }
};
const badgeCount = (n: number) => {
  const unseenMassagesEdge: number = 9;
  return n > unseenMassagesEdge ? unseenMassagesEdge + "+" : n;
};

function PaneLastMessage({
  last_message_content,
}: {
  last_message_content: string | undefined;
}) {
  return <p className={style.panel_last_message}>{last_message_content}</p>;
}

interface DiscussionPanelProps {
  onSelect: (panel: DiscussionDto) => void;
  DiscussionPanel: DiscussionDto;
  isSelected: boolean;
  showUserActionModal: () => void;
  currentRoute :"Direct_messaging" | "Channels";
}

function DiscussionPanel({
  onSelect,
  DiscussionPanel,
  isSelected,
  showUserActionModal,
  currentRoute,
  
}: DiscussionPanelProps) {
  const panelThemeClass = clsx({
    [style.discussion_panel_default_colors]: isSelected === false,
    [style.discussion_panel_selection_colors]: isSelected === true,
  });

  const enableUnseenMessage = () =>
    !isSelected && DiscussionPanel.unread_messages != 0;
  const handleDiscussionPanelClick = () => {
    onSelect(DiscussionPanel);
    socket.emit("MarkMsgRead", { _id: DiscussionPanel.id });
  };

  console.log('>>DiscussionPanel', DiscussionPanel)
  const panel = findDiscussions(currentRoute,DiscussionPanel.partner_id, DiscussionPanel.id);
  return (
    <>
      {panel && (
        <li
          className={`${style.discussion_panel} ${panelThemeClass} `}
          onClick={handleDiscussionPanelClick}
        >
          <Avatar src={panel.avatar} avatarToRight={false} channelType={panel.type} />

          <div className={style.panel_central_part}>
            <h3>{panel.name}</h3>
            <PaneLastMessage
              last_message_content={DiscussionPanel.last_message?.content}
            />
          </div>
          <div className={style.panel_last_part}>
            <button className={panelThemeClass} onClick={showUserActionModal}>
              •••
            </button>
            <TimeStamp time={DiscussionPanel.last_message?.createdAt} />
            {enableUnseenMessage() && (
              <div className={style.panel_message_notifier}>
                {badgeCount(DiscussionPanel.unread_messages)}
              </div>
            )}
          </div>
        </li>
      )}
    </>
  );
}

export default DiscussionPanel;
