import { useEffect, useState } from "react";
import { DiscussionDto, MinMessageDto, discussionPanelSelectType } from "../../../interfaces/DiscussionPanel";
import style from "./DiscussionsBar.module.css";
import { fetchDataFromApi } from "../../shared/customFetch/exmple";
import DiscussionPanel from "../../shared/DiscussionPanel/DiscussionPanel";
import { useHandlePanel } from "../../../../../hooks/useHandlePanel";
import { useRouter } from "next/router";
import UserActionModalMain from "../UserActionModal/UserActionModal";
import socket from "../../../socket/socket";

interface DiscussionsBarProps {
    selectedDiscussionState:{
      selectedDiscussion : discussionPanelSelectType,
      selectDiscussion : (e: discussionPanelSelectType) => void
  },
  currentRoute :"Direct_messaging" | "Channels"
}
  

export function DiscussionsBar({ selectedDiscussionState, currentRoute }: DiscussionsBarProps) {
    const [discussionPanels, setDiscussionRooms] = useState<DiscussionDto[]>([]);
    const [modalIsVisible, setModalAsVisible] = useState<boolean>(false);
    const {selectedDiscussion, selectDiscussion} = selectedDiscussionState;
    const [channelData, setChannelData] = useState<ChannelData |  undefined>(undefined)

    console.log ("Current route ", currentRoute)

    useEffect(() => {
      async function fetchDataAsync() {
        const fetchedData = await fetchDataFromApi(
          `http://localhost:3001/chat/${currentRoute}/discussionsBar`
          );
        if (currentRoute === "Direct_messaging")
          setDiscussionRooms(fetchedData);
        else 
          {
            const room_data:DiscussionDto[] =  fetchedData.map( (item : DiscussionDto)=>{
              return {id:item.id,
                      partner_id: item.partner_id,
                      last_message: item.last_message,
                      unread_messages:item.unread_messages}
            })
            setDiscussionRooms(room_data);
            console.log ("Room Data: ", room_data)
            const channelFetchedData = 
            {
              channelOwner: fetchedData.channelOwner, 
              channelAdmins:fetchedData.channelAdmins,
              channelBans: fetchedData.channelBans,
            }
            setChannelData (channelFetchedData)
          }
      }
      fetchDataAsync();
    }, []);
    
    useHandlePanel(discussionPanels,selectedDiscussion, setDiscussionRooms)


    const handlePanelClick = (panelData: DiscussionDto) => {
      selectDiscussion(panelData);
      const updatedRooms = [...discussionPanels];
      
      const indexToModify = updatedRooms.findIndex(
        (item) => item.id === panelData.id
        );
        if (indexToModify !== -1) {
          updatedRooms[indexToModify].unread_messages = 0;
          setDiscussionRooms(updatedRooms);
        }
        if (currentRoute === "Channels")
          socket.emit ("recordVisit", )
      };
       
    const displayActionModal = () => setModalAsVisible(true);
    return (
      <ul className={style.discussion_panel_bar}>
        {discussionPanels.map((panelElement) => {
          const isSelected = panelElement?.id === selectedDiscussion.id;
          return (  
            <DiscussionPanel
              key={panelElement.id}
              onSelect={handlePanelClick}
              DiscussionPanel={panelElement}
              isSelected={isSelected}
              showUserActionModal={displayActionModal}
            />
          );
        })}
          {currentRoute === "Direct_messaging" && (
            <UserActionModalMain
              userToActId={selectedDiscussion.partner_id}
              DiscussionToActId={selectedDiscussion.id}
              modalState={[modalIsVisible, setModalAsVisible]}
              ActionContext={currentRoute}
            />)}
          {currentRoute === "Channels" && (
            <UserActionModalMain
              DiscussionToActId={selectedDiscussion.id} 
              channel_data={channelData}
              modalState={[modalIsVisible, setModalAsVisible]}
              ActionContext={currentRoute}
            />)}
      </ul>
    );
  }
 