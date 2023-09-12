import { useEffect, useRef, useState } from "react";
import ChatTextBox from "../shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../shared/DiscussionPanel/DiscussionPanel";
import style from "./DirectMsgMain.module.css";
import Message from "../shared/Message/Message";
import UserActionModalMain from "./UserActionModal/UserActionModal";

    /*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */

function DiscussionsBar({discussionPanelState, discussionPanels }) {
  const [selectedDiscussionPanel, selectDiscussionPanel] = discussionPanelState;
  
  const [modalIsVisible, setModalAsVisible] = useState(false)

  const displayActionModal = (e)=>{
    // e.stopPropagation()
    setModalAsVisible(true)
  }
  const handlePanelClick = (panelData) =>{
    selectDiscussionPanel(panelData);
  }
  return (
      <ul className={style.discussion_panel_bar}>
        {discussionPanels.map((panelElement) => {
          const isSelected = (panelElement?.id === selectedDiscussionPanel?.id)
          return <DiscussionPanel key={panelElement.id} onSelect={handlePanelClick}  DiscussionPanel={panelElement} 
                                  isSelected={isSelected} showUserActionModal={displayActionModal}/>;
        })}
        <UserActionModalMain userData={selectedDiscussionPanel} modalState={[modalIsVisible, setModalAsVisible]}/>
      </ul>
  );
}




function MessagesHistory({messages}) {
  const scrollDown = useRef(null)

  const scrollToBottom = ()=>{
    if (scrollDown.current != null)
      scrollDown.current.scrollIntoView({
          block: 'end'
        });
  }

  useEffect (()=>
    {
      scrollToBottom ();
    }, [messages]
  )
  return (
    <div className={style.messages_history}>
      {
        messages.map ( (messageElement, index) =>{
          //Don't forget to add key attribute to messages
          return <Message key={index} messageData= {messageElement} sentMessage={messageElement.name === "samajat"}/>
        })
        
      }
      <div   style={{marginTop:"100px"}} ref={scrollDown}></div>
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
    <div className={style.chat_field}>
      <MessagesHistory  messages={messagesHistory}/>

      <ChatTextBox messagesHistoryState={[messagesHistory, setMessageHistory]} />
    </div>
  );
}



function DirectMesgMain() {
  const [roomPanels_data, setDiscussionRooms] = useState([]);
  const [selectedDiscussionPanel, selectDiscussionPanel] = useState(null)//this must be the id of the channel

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
