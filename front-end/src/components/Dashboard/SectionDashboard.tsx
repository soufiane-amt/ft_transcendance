import React, {useState} from "react"
import {FaSearch} from 'react-icons/fa'
import HomePage from "./HomePage"
import Statictic from "./Statictic"
import History from "./History"
import Friends from "./Friends"
import AddUser from "./Adduser"

interface SectionProps {
  selectSelection: string;
}

const SectionDashboard: React.FC<SectionProps> = ({selectSelection}) =>
{
  const renderSelectSection = () =>
  {
      switch(selectSelection)
      {
        case 'home':
          return <HomePage />;
        case 'statistic':
          return <Statictic />;
        case 'friends':
          return <Friends />;
        case 'history':
          return <History />;
        case 'add-user':
          return <AddUser />
      }
  }
    return (
        <>
        <div className="home-page">
          {renderSelectSection()}
        </div>
        </>
    );
};

export default SectionDashboard;