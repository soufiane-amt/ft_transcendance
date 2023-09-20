import React, { useState } from 'react'
import style from './ChatTextbox.module.css'
import { Send } from '../../svgs'
import { formatDateAndTime } from '../../../utils/dateUtils';


const username ="samajat";
const avatar = "/images/avatar.png"
const user_id = "1"


interface ChatTextBoxProps {
  showTextBox :boolean
  messagesHistoryState : [messageDto[], React.Dispatch<React.SetStateAction<messageDto[]>>]
}

function ChatTextBox ({messagesHistoryState, showTextBox}: ChatTextBoxProps)
{
  const [messagesHistory, setMessageHistory] = messagesHistoryState
  const defaultMessageValue: messageDto = {
    id: "",
    user_id: "",
    content: "",
    createdAt: "",
  };
  const [newMessage, setNewMessage] = useState <messageDto> (defaultMessageValue)

  const  handleSendMessage = () =>{ 
    setMessageHistory([...messagesHistory, newMessage])
    setNewMessage(defaultMessageValue)
  }


  if (showTextBox === false)
    return null;
    return (
      
        <div className={`${style.message_bar} ${style.middlePos}`} >
            <textarea className={`${style.message_input_bar} `} 
            placeholder='Type a message...'
            value={newMessage.content}
            onChange={(e) => setNewMessage({id:"",user_id, content:e.target.value, createdAt: formatDateAndTime(new Date().toString()) })}
            />
            <Send onClick={handleSendMessage} className={`${style.message_send_icon__init_fill} ${style.message_send_icon}`}/>
        </div>
    )

}
export default ChatTextBox;
