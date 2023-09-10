import { useEffect, useState } from "react";
import ChatTextBox from "../shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../shared/DiscussionPanel/DiscussionPanel";
import style from "./DirectMsgMain.module.css";
import Message from "../shared/Message/Message";


function DiscussionsBar({ discussionPanels }) {
  return (
    <ul className={style.discussion_panel_bar}>
      {discussionPanels.map((panelElement) => {
        return <DiscussionPanel DiscussionPanel={panelElement} />;
      })}
    </ul>
  );
}

function MessagesHistory({messages}) {
  return (
    <div className={style.messages_history}>
      {
        messages.map ( (messageElement) =>{
          return <Message messageData= {messageElement} sentMessage={true}/>
        })
      }
    </div>
  );
}

function ChattingField({selectedDiscussion}) {
  const lol = selectedDiscussion;
  const [messagesHistory, setMessageHistory] = useState ([])

  useEffect(() => {
    async function fetchDataAsync() {
      const result = await fetch("dataMessage.json");
      const data = await result.json();
      setMessageHistory(data)
    }
    fetchDataAsync();
  }, []);

  return (
    <div className={style.chat_field}>
      <MessagesHistory messages={messagesHistory}/>
      <ChatTextBox />
    </div>
  );
}

function DirectMesgMain() {
  const [desPanels_data, setDiscussionRooms] = useState([]);
  const [selectedDiscussionPanel, setDiscussionPanel] = useState("")

  useEffect(() => {
    async function fetchDataAsync() {
      const result = await fetch("dataBar.json");
      const data = await result.json();
      setDiscussionRooms(data);
    }
    fetchDataAsync();
  }, []);

  return (
    <div className={style.direct_msg_main}>
      <DiscussionsBar discussionPanels={desPanels_data} />
      <ChattingField selectedDiscussion={selectedDiscussionPanel}/>
    </div>
  );
}

export default DirectMesgMain;
