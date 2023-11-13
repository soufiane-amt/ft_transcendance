import { ChatLeftBar } from "../../../components/Chat/ChatLeftBar/ChatLeftBar";
import { CreateChannel } from "../../../components/Chat/CreateChannel/CreateChannel";
import style from '../page.module.css';



export default function CreateChannelPage() {
  
    return (
        <div className={style.initial_arranging}>
            <ChatLeftBar activateShrinkMode={false}/>
            <CreateChannel/>
        </div>
      )
  }
  