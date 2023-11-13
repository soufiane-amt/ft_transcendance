import React, {  ReactNode, useState } from "react";
import { ChannelSetting } from "../ChannelSetting/ChannelSetting";
import { ModerationToolBox, getUserRole } from "../ModerationToolBox/ModerationToolBox";
import style from "../../../../styles/ChatStyles/ChannelActionModal.module.css";
import { useOutsideClick } from "../../../../CustomHooks/useOutsideClick";
import { useSessionUser } from "../../../../app/context/SessionUserContext";
import { LeaveChannel } from "../../shared/LeaveChannel/LeaveChannel";
import { ChannelData } from "../../interfaces/ChannelData";



const TabInfo = ({att, children}:{att:string, children:ReactNode}) =>{
  return (
    <div>{children}</div>
  )
}

const Tabs = ({children}:{children:ReactNode[]})=>{
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className={style.lol}>
      <div className={style.tabs}>
      {
        children.map((child :any, index: any) => {
          return child && <Tab
            key={index}
            index={index}
            activeTab= {activeTab}
            setActiveTab={setActiveTab}
            data_label={child.props.att}
          />
      })
      }
        </div>
      <div>
        {
          children[activeTab]
        }
      </div>
    </div>
  );
};

const Tab = ({index, activeTab, setActiveTab,  data_label}:{index:any, activeTab:any, setActiveTab:any,  data_label:any})=>{

  const handleClick = ()=>{
    setActiveTab(index)
  }

  return (
      <div  className={index === activeTab ? `${style.tab} ${style.tab_active}` : `${style.tab}`} onClick={handleClick}>
          {data_label}
      </div>
  )
}


interface ChannelActionModalProps {
  selectedDiscussionId:string, 
  channelData: ChannelData |undefined,
  handleVisibility: (parm: boolean) => void, 
}
const ChannelActionModal = ({selectedDiscussionId, channelData, handleVisibility}:ChannelActionModalProps)=>{
  const currentUser = useSessionUser();
  const ref = useOutsideClick(handleVisibility);
  const currentUserGrade = getUserRole(useSessionUser().id, channelData) 
  const checkUserBan = () => {
    return (channelData?.channelBans.find((user) => user === currentUser.id) != null);
  }
  return (
    <div ref={ref} className={style.modal}>
      <Tabs>
          {
            //Check if user is banned from channel
            !checkUserBan() &&
            <TabInfo att={"Show users"}>
              <ModerationToolBox selectedChannel={selectedDiscussionId} channelData={channelData} />
            </TabInfo>
          }
          {
            currentUserGrade === 'Owner' && 
            <TabInfo att={"Channel settings"}>
              <ChannelSetting channel_id={selectedDiscussionId}/>
            </TabInfo>
          }
         <TabInfo att={"Channel MemberShip"}>

            <LeaveChannel selectedDiscussion={selectedDiscussionId} userGrade={currentUserGrade} channelUsers={channelData?.channelUsers}/>
        </TabInfo>

      </Tabs>

    </div>
  )
}

export default ChannelActionModal;