import React, {useState} from "react";
import Section from './Section';
import SectionDashboard from './SectionDashboard';
import AddUser from "./Adduser";
import Aside from './Aside';
import { useEffect } from 'react';
import Cookies from "js-cookie";
import  newSocket from '../../components/GlobalComponents/Socket/socket'


function DisplayComponent()
{
    const [myindex, setmyindex] = useState('home');

    const handleSelectSection = (section: string) =>
    {
      setmyindex(section);
    }
    const JwtToken = Cookies.get("access_token");
  useEffect(() => {
        const statusData = {
            token: `Bearer ${JwtToken}`
        }
        newSocket.emit('status', statusData);
  }, [JwtToken]);
    return (
        <>
        <Aside onSelectSection={handleSelectSection}></Aside>
        {myindex === 'add-user' ? (<AddUser></AddUser>): (
        <>
        <Section></Section>
        <SectionDashboard selectSelection={myindex}></SectionDashboard>
        </>
        )}
        </>
    );
}

export default DisplayComponent;