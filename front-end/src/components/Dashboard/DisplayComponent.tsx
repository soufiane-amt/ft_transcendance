import React, {useState} from "react";
import Section from './Section';
import SectionDashboard from './SectionDashboard';
import AddUser from "./Adduser";
import Aside from './Aside'


function DisplayComponent()
{
    const [myindex, setmyindex] = useState('home');

    const handleSelectSection = (section: string) =>
    {
      setmyindex(section);
    }
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