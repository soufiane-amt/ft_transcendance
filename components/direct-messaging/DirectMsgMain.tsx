
import { useEffect, useState } from "react";
import ChatTextBox from "../shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../shared/DiscussionPanel/DiscussionPanel";
import Message from "../shared/Message/Message";
import style from "./DirectMsgMain.module.css"
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CONFIG_FILES } from "next/dist/shared/lib/constants";
import dataFile from '../../data/dataBar.json'


type Discussion = {
  id : string
  user1_id :string
  user2_id :string
  status : 'ALLOWED' | 'BANNED'
  createdAt: string
  updatedAt: string
}

function DiscussionsBar ({discussionPanels })
{

  return (
    <ul className={style.discussion_panel_bar}>
      {
        discussionPanels.map ( (panelElement) => {
          return <DiscussionPanel DiscussionPanel={panelElement} />
      })
      }
      {/* <DiscussionPanel DiscussionPanel={discussionPanels[0]} /> */}
    </ul>
  )
}

function MessagesHistory ()
{
  return (
    <div className={style.messages_history}>  
      {/* <Message sentMessage={true}/> */}
    </div>
  )
}

function ChattingField ()
{
  return (
    <div className={style.chat_field}>
      <MessagesHistory/>
      <ChatTextBox/>
    </div>

  )
}

// const rooms_data = [{      
//               id: "1",
//               user1_id: "user1",
//               user2_id: "user2",
//               status: "SENT",
//               createdAt: "2023-09-10T08:00:00Z",
//               updatedAt: "2023-09-10T08:00:00Z"}]

function DirectMesgMain()
{
    const [rooms_data, setRoom] = useState([])
    useEffect(() => {
      async function fetchDataAsync() {
          const result = await fetch('data/dataBar.json');
          const data = await result.json();
          setRoom(data);
      }
        fetchDataAsync();
      }, [])
  
    return (
        <div className={style.direct_msg_main}>
          <DiscussionsBar discussionPanels={rooms_data} />
          <ChattingField/>
        </div>
    )
}

export default DirectMesgMain;