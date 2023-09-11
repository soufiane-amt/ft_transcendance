import { useState } from 'react'
import style from './ChatTextbox.module.css'


function ChatTextBox ({messagesHistoryState})
{
  const [messagesHistory, setMessageHistory] = messagesHistoryState
  const defaultMessageValue = {name:"", content:"", created_at: "", avatar: ""}
  const [newMessage, setNewMessage] = useState (defaultMessageValue)

  const  handleSendMessage = () =>{ 
    setMessageHistory([...messagesHistory, newMessage])
    setNewMessage(defaultMessageValue)
  }

  const sendMsgIcon = <svg  onClick={handleSendMessage}
    className={`${style.message_send_icon__init_fill} ${style.message_send_icon}`}
    viewBox="26 14 184 186"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M85.8621 90.0479L56.2882 50.1258C54.3088 47.4538 53.3191 46.1178 53.8275 45.5134C54.3359 44.909 55.8216 45.6554 58.7931 47.1481L153.76 94.8559C155.366 95.6628 156.169 96.0663 156.159 96.6935C156.15 97.3208 155.335 97.6995 153.705 98.4569L78.6972 133.308C77.016 134.089 76.1754 134.48 75.688 134.07C75.2005 133.66 75.4414 132.764 75.9232 130.974L86.3871 92.0956L118.042 94.5992C118.592 94.6427 119.074 94.2317 119.118 93.6811C119.161 93.1306 118.75 92.6489 118.2 92.6054L85.8621 90.0479Z"
    />
  </svg>


        
    return (
        <div id="box" className={`${style.message_bar} ${style.middlePos}`}>
            <textarea className={`${style.message_input_bar} `} 
            placeholder='Type a message...'
            value={newMessage.content}
            onChange={(e) => setNewMessage({name:"samajat", content:e.target.value, created_at: "2023-09-10T08:00:00Z", avatar: "/images/avatar.png"})}
            />
            {sendMsgIcon}
        </div>
    )

}
export default ChatTextBox;
