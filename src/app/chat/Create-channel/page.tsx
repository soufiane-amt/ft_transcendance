import { ChatLeftBar } from "../../components/ChatLeftBar/ChatLeftBar";
import { CreateChannel } from "../../components/CreateChannel/CreateChannel";
import style from '../page.module.css';



export default function CreateChannelPage() {
  
    return (
        <div className={style.initial_arranging}>
            <ChatLeftBar/>
            <CreateChannel/>
        </div>
      )
  }
  