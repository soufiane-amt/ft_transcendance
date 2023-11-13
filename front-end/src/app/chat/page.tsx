'use client'

import { ChatLeftBar } from '../../components/Chat/ChatLeftBar/ChatLeftBar'
import { WelcomingPage } from '../../components/Chat/Welcoming/WelcomingPage'
import { SessionUserProvider } from '../context/SessionUserContext';
import style from './page.module.css';



export default function page() {
  
  return (
      <div className={style.initial_arranging}>
        <ChatLeftBar activateShrinkMode={false}/>
        <WelcomingPage/>
      </div>
    )
}

