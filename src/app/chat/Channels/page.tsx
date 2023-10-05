'use client'

import { Flow_Rounded } from "next/font/google"
import ChannelsMain from "../../components/Channels/ChannelsMain"
import { SessionUserProvider } from "../../context/SessionUserContext"


import React, {  useState } from "react";


const Hello = ()=>{
  return (
    <div style={{background:"red"}}>
        Hello world
    </div>
  )
}

const Modal = ()=>{
  return (
    <div className="modal">
      <Tabs>
          <div data_label="Option1">salam</div>
          <div data_label="Option2">
            <Hello/>
          </div>
          <div data_label="Option3">hola</div>
      </Tabs>

    </div>
  )
}

const Tabs = ({children})=>{
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="body">
      <div className="tabs">
      {children.map((child, index) => (
          <Tab
            key={index}
            index={index}
            activeTab= {activeTab}
            setActiveTab={setActiveTab}
            data_label={child.props.data_label}
          />
        ))}
        <div>
          {
            children[activeTab]
          }
        </div>
      </div>
    </div>
  );
};

const Tab = ({index, activeTab, setActiveTab,  data_label})=>{

  console.log(index)
  const handleClick = ()=>{
    setActiveTab(index)
  }
  return (
      <div  className={index === activeTab ? "tab tab_active" : "tab"} onClick={handleClick}>
          {data_label}
      </div>
  )
}
export default function Channels() {
  
    // <SessionUserProvider>
    //     <ChannelsMain/>
    // </SessionUserProvider>
    
  return (
    )
}
