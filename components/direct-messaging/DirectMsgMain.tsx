import { useEffect, useState } from "react";
import ChatTextBox from "../shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../shared/DiscussionPanel/DiscussionPanel";
import style from "./DirectMsgMain.module.css";
import Message from "../shared/Message/Message";


function DiscussionsBar({discussionPanelState, discussionPanels }) {
  const [selectedDiscussionPanel, selectDiscussionPanel] = discussionPanelState;

  const handlePanelClick = (panelData) =>{
    selectDiscussionPanel(panelData);
  }
  return (
    <ul className={style.discussion_panel_bar}>
      {discussionPanels.map((panelElement) => {
        return <DiscussionPanel key={panelElement.id} onSelect={handlePanelClick} DiscussionPanel={panelElement} isSelected={(panelElement?.id === selectedDiscussionPanel?.id)}/>;
      })}
    </ul>
  );
}

function MessagesHistory({messages}) {
  return (
    <div className={style.messages_history}>
      {
        messages.map ( (messageElement) =>{
          //Don't forget to add key attribute to messages
          return <Message messageData= {messageElement} sentMessage={messageElement.name === "samajat"}/>
        })
      }
    </div>
  );
}

function ChattingField({selectedDiscussion}) {
  const [messagesHistory, setMessageHistory] = useState ([])

  useEffect(() => {
    async function fetchDataAsync() {

      if (selectedDiscussion !== null)
      {
        const result = await fetch("dataMessage"+selectedDiscussion?.id+".json");
        const data = await result.json();
        setMessageHistory(data)
      }
    }
    fetchDataAsync();
  }, [selectedDiscussion]);

  return (
    <div id="chatField" className={style.chat_field}>
      <MessagesHistory  messages={messagesHistory}/>
      <ChatTextBox messagesHistoryState={[messagesHistory, setMessageHistory]}/>
    </div>
  );
}



function DirectMesgMain() {
  const [roomPanels_data, setDiscussionRooms] = useState([]);
  const [selectedDiscussionPanel, selectDiscussionPanel] = useState(null)

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
      <DiscussionsBar discussionPanelState={[selectedDiscussionPanel, selectDiscussionPanel]}  discussionPanels={roomPanels_data} />
      <ChattingField selectedDiscussion={selectedDiscussionPanel}/>
    </div>
  );
}

export default DirectMesgMain;
