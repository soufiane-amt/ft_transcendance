'use client'

import { ChatLeftBar } from '../components/ChatLeftBar/ChatLeftBar'
import { UserInitiativeTalk } from '../components/Welcoming/UserInitiativeTalk/UserInitiativeTalk'
import { WelcomingPage } from '../components/Welcoming/WelcomingPage'
// import { UserInitiativeTalk } from '../../components/WelcomingPage/UserInitiativeTalk/UserInitiativeTalk.1'
import style from './page.module.css';



export default function page() {
  
  return (
    <div className={style.initial_arranging}>
      <ChatLeftBar/>
      <WelcomingPage/>
    </div>
    )
}
