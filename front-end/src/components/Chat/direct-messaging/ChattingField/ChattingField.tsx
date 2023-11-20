'use client'
import { useEffect, useRef, useState } from "react";
import { discussionPanelSelectType } from "../../interfaces/DiscussionPanel";
import { fetchDataFromApi } from "../../CustomFetch/fetchDataFromApi";
import ChatTextBox from "../../shared/ChatTextbox/ChatTextbox";
import style from "../../../../styles/ChatStyles/ChattingField.module.css";
import Message from "../../shared/Message/Message";
import { selectedPanelDefault } from "../DirectMsgMain";



function MessagesHistory({ messages }: { messages: messageDto[] }) {
    const scrollDown = useRef<HTMLDivElement>(null);
  
    const scrollToBottom = () => {
      if (scrollDown.current != null)
        scrollDown.current.scrollIntoView({
          block: "end",
        });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
    return (
      <div className={style.messages_history}>
        {messages && messages.map((messageElement: messageDto) => {
          console.log ('Message_id: ', messageElement)
          return <Message key={messageElement.id} messageData={messageElement} />;
        })}
        {
        /* this is a dummy div created so that it references the bottom of the chatfield to scroll there whenever a message comes */}
        <div style={{ marginTop: "100px" }} ref={scrollDown}></div>
      </div>
    );
  }
  
  

  
  interface ChattingFieldPops {
    openBar: boolean,
    selectDiscussionState: {
      selectedDiscussion : discussionPanelSelectType,
      selectDiscussion : (e: discussionPanelSelectType) => void
  
    }
  }
  export function ChattingField({openBar, selectDiscussionState }: ChattingFieldPops) {
    const { selectedDiscussion, selectDiscussion } = selectDiscussionState;
    const [messagesHistory, setMessageHistory] = useState<messageDto[]>([]);

    useEffect(() => {
      async function fetchDataAsync() {
        const messagesHistory_tmp = await fetchDataFromApi(
          `http://localhost:3001/chat/${selectedDiscussion.id}/messages`
        );
        setMessageHistory(messagesHistory_tmp);
      }
      if (selectedDiscussion != selectedPanelDefault && selectedDiscussion.id ) fetchDataAsync();
    }, [selectedDiscussion]);
  
    return (
      <div className={`${style.chat_field} ${!openBar ? style.chat_field_close : ''}`}>
        <MessagesHistory messages={messagesHistory} />
  
        <ChatTextBox
          selectedDiscussion={selectedDiscussion}
          messagesHistoryState={[messagesHistory, setMessageHistory]}
   />
      </div>
    );
  }
  
  