import React, { useEffect, useRef, useState } from "react";
import style from "../../../../styles/ChatStyles/DiscussionPanel.module.css"; // Import styles
import { DiscussionDto } from "../../interfaces/DiscussionPanel";
import Avatar from "../Avatar/Avatar";
import TimeStamp from "../TimeStamp/TimeStamp";
import { useFindUserContacts } from "../../../../app/context/UsersContactBookContext";
import socket from "../../../../app/socket/socket";
import clsx from "clsx";
import { useFindChannelBook } from "../../../../app/context/ChannelInfoBook";
import { UserContactDto, useSessionUser } from "../../../../app/context/SessionUserContext";

const findDiscussions = (
  currentRoute : "Direct_messaging" | "Channels",
  partner_id: string | undefined,
  userContacts: UserContactDto |undefined ,
  discussion_id: string, //This id is either the id of channel or the id of the user to dm
  sessionUserData: UserContactDto,
) => {
  // useFindUserContacts(partner_id)
  if (currentRoute === "Direct_messaging") {
      if (partner_id !== undefined) {
        const discussion_data = userContacts;
        if (!discussion_data) return undefined;
        return {
          name: discussion_data.username,
          avatar: discussion_data.avatar,
          };
        }
        else{
          const discussion_data = sessionUserData;
          if (!discussion_data) return undefined;
          return {
            name: discussion_data.username,
            avatar: discussion_data.avatar,
          };
        } 
    }
  else {
    const discussion_data = useFindChannelBook(discussion_id);
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


interface PaneLastMessageProps{
  last_message_content: string | undefined;
  messageIsUnread : boolean;
}

function PaneLastMessage({
  last_message_content,
  messageIsUnread,
}: PaneLastMessageProps) {
  return (<p className={`${style.panel_last_message} 
             ${messageIsUnread ? style.panel_last_message__unread_state : ''}`}>
          {last_message_content}
        </p>);
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
  const sessionUser = useSessionUser();
  const sessionUserContacts: UserContactDto |undefined =  useFindUserContacts(DiscussionPanel.partner_id);

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

  const panel = findDiscussions(currentRoute,
            DiscussionPanel.partner_id,
             sessionUserContacts,
             DiscussionPanel.id,
              sessionUser);
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
              messageIsUnread={DiscussionPanel.unread_messages > 0}
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
