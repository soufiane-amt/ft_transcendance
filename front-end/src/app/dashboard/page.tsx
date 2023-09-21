"use client";
import '@/styles/Dashboard.css'
import Structure from '@/app/Structure';
import DashboardTwoFa from '@/components/2fa/DashboardTwoFa';
import { useState } from 'react';
import DisplayComponent from '@/components/Dashboard/DisplayComponent';


function Dashboard() {
  const [twofa, setTwofa] = useState(false);
  return (
    <Structure>
      {/* <DisplayComponent></DisplayComponent> */}
      <h1>here I will activate 2fa</h1>
      <h3 onClick={() => {!twofa ? setTwofa(true): setTwofa(false)}}>2fa</h3>
      {twofa &&  <DashboardTwoFa></DashboardTwoFa>}
    </Structure>
  );
}

export default  Dashboard;