import React, { useRef, useState } from 'react'
import style from './ChatTextbox.module.css'
import { NoFallbackError } from 'next/dist/server/base-server'
import { Send } from '../../svgs'


const username ="samajat";
const avatar = "/images/avatar.png"
const user_id = "1"


interface ChatTextBoxProps {
  messagesHistoryState : [messageDto[], React.Dispatch<React.SetStateAction<messageDto[]>>]
}

function ChatTextBox ({messagesHistoryState}: ChatTextBoxProps)
{
  const [messagesHistory, setMessageHistory] = messagesHistoryState
  const defaultMessageValue: messageDto = {
    id: "",
    user_id: "",
    content: "",
    created_at: "",
  };
  const [newMessage, setNewMessage] = useState <messageDto> (defaultMessageValue)

  const  handleSendMessage = () =>{ 
    setMessageHistory([...messagesHistory, newMessage])
    setNewMessage(defaultMessageValue)
  }

    return (
        <div className={`${style.message_bar} ${style.middlePos}`} >
            <textarea className={`${style.message_input_bar} `} 
            placeholder='Type a message...'
            value={newMessage.content}
            onChange={(e) => setNewMessage({id:"",user_id, content:e.target.value, created_at: "time"})}
            />
            <Send onClick={handleSendMessage} className={`${style.message_send_icon__init_fill} ${style.message_send_icon}`}/>
        </div>
    )

}
export default ChatTextBox;
