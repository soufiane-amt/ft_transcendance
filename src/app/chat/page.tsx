'use client'

import { ChatLeftBar } from '../components/ChatLeftBar/ChatLeftBar'
import { WelcomingPage } from '../components/Welcoming/WelcomingPage'
import { SessionUserProvider } from '../context/SessionUserContext';
import style from './page.module.css';



export default function page() {
  
  return (
      <div className={style.initial_arranging}>
        <ChatLeftBar/>
        <WelcomingPage/>
      </div>
    )
}

