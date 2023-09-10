
import { useState } from "react";
import ChatTextBox from "../shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../shared/DiscussionPanel/DiscussionPanel";
import Message from "../shared/Message/Message";
import style from "./DirectMsgMain.module.css"



function DiscussionsBar ()
{
  return (
    <div className={style.discussion_panel_bar}>
      <DiscussionPanel/>
    </div>
  )
}

function MessagesHistory ()
{
  return (
    <div className={style.messages_history}>  
      <Message sentMessage={true}/>
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
function DirectMesgMain()
{
    return (
        <div className={style.direct_msg_main}>
          <DiscussionsBar/>
          <ChattingField/>
        </div>
    )
}

export default DirectMesgMain;