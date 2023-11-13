<<<<<<< HEAD
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

=======
import Structure from "../Structure";

export default function Dashboard() {
  return (
    <Structure>
      <h1>chat</h1>
    </Structure>
  );
}
>>>>>>> origin/game_dashboard
