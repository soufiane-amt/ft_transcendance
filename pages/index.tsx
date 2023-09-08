import ChatTextBox from "../components/shared/ChatTextbox/ChatTextbox";
import Message from "../components/shared/Message/Message";

export default function Home() {
  return (
    <div className="name">
      <Message sentMessage={true}/>
      <ChatTextBox/>
    </div>
    )
}
