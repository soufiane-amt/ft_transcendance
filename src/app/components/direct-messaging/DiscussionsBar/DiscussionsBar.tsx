import { useEffect, useState } from "react";
import { DiscussionDto, MinMessageDto, discussionPanelSelectType } from "../../../interfaces/DiscussionPanel";
import style from "./DiscussionsBar.module.css";
import { fetchDataFromApi } from "../../shared/customFetch/exmple";
import DiscussionPanel from "../../shared/DiscussionPanel/DiscussionPanel";
import { useHandlePanel } from "../../../../../hooks/useHandlePanel";
import { useRouter } from "next/router";
import UserActionModalMain from "../UserActionModal/UserActionModal";

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

    useEffect(() => {
      async function fetchDataAsync() {
        const roomPanels_data_tmp = await fetchDataFromApi(
          `http://localhost:3001/chat/${currentRoute}/discussionsBar`
          );
        setDiscussionRooms(roomPanels_data_tmp);
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
        {
            <UserActionModalMain
              userToActId={selectedDiscussion.partner_id}
              DiscussionToActId={selectedDiscussion.id}
              modalState={[modalIsVisible, setModalAsVisible]}
              ActionContext={currentRoute}
            />
        }
      </ul>
    );
  }
