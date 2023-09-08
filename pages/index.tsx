import ChatTextBox from "../components/shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../components/shared/DiscussionPanel/DiscussionPanel";
import Message from "../components/shared/Message/Message";

export default function Home() {
  return (
    <div className="all">
      <div className="bar_part">
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
        <DiscussionPanel/>
      </div>

      <div className="chat_field">
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        
        <Message sentMessage={false}/>
        <Message sentMessage={true}/>
        <Message sentMessage={false}/>
        <Message sentMessage={true}/> 
        <ChatTextBox/>
      </div>
    </div>

    )
}
