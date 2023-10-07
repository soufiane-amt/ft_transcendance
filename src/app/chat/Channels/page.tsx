'use client'

import ChannelsMain from "../../components/Channels/ChannelsMain"
import { SessionUserProvider } from "../../context/SessionUserContext"
import style from "../../components/Channels/ChannelsMain.module.css";


import React, {  ReactNode, useState } from "react";


const Hello = ()=>{
  return (
    <div >
        Hello world
    </div>
  )
}
const Fuck = ()=>{
  return (
    <div >
        Fuck yah
    </div>
  )
}

const DummyTab = ({att, children}:{att:string, children:ReactNode}) =>{
  return (
    <div>{children}</div>
  )
}
const Modal = ()=>{
  return (
    <div className={style.modal}>
      <Tabs>
          <DummyTab att={"Option1"}>Option1</DummyTab>
          <DummyTab att={"Option2"}>
            <Fuck/>
          </DummyTab>
          <DummyTab att={"Option3"}>
            <Hello/>
          </DummyTab>
          <DummyTab att={"Option4"}>Option4</DummyTab>
      </Tabs>

    </div>
  )
}

const Tabs = ({children}:{children:ReactNode[]})=>{
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className={style.lol}>
      <div className={style.tabs}>
      {
        children.map((child :any, index: any) => (
          <Tab
            key={index}
            index={index}
            activeTab= {activeTab}
            setActiveTab={setActiveTab}
            data_label={child.props.att}
          />
        ))
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

  console.log(index)
  const handleClick = ()=>{
    setActiveTab(index)
  }

  return (
      <div  className={index === activeTab ? `${style.tab} ${style.tab_active}` : `${style.tab}`} onClick={handleClick}>
          {data_label}
      </div>
  )
}
export default function Channels() {
  
    <SessionUserProvider>
        <ChannelsMain/>
    </SessionUserProvider>
  
  return (
    <Modal/>
    )
}
