import React, {  ReactNode, useState } from "react";
import { ChannelSetting } from "../ChannelSetting/ChannelSetting";
import { ModerationToolBox, getUserRole } from "../ModerationToolBox/ModerationToolBox";
import style from "./ChannelActionModal.module.css";
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";
import { useSessionUser } from "../../../context/SessionUserContext";
import { LeaveChannel } from "../../shared/LeaveChannel/LeaveChannel";



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
  const ref = useOutsideClick(handleVisibility);
  const IsModerator = getUserRole(useSessionUser().id, channelData) !== "Member"
  console.log ("IsModerator : ", IsModerator)
  return (
    <div ref={ref} className={style.modal}>
      <Tabs>
          <TabInfo att={"Show users"}>

            <ModerationToolBox channelData={channelData} />
          </TabInfo>
          {
            IsModerator && 
            <TabInfo att={"Channel settings"}>
              <ChannelSetting channel_id={selectedDiscussionId}/>
            </TabInfo>
          }
         <TabInfo att={"Channel MemberShip"}>

            <LeaveChannel/>
        </TabInfo>

      </Tabs>

    </div>
  )
}

export default ChannelActionModal;