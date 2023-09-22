"use client";
import '@/styles/Dashboard.css'
import Structure from '@/app/Structure';
import DisplayComponent from '@/components/Dashboard/DisplayComponent';


function Dashboard() {
  return (
    <Structure>
      <DisplayComponent></DisplayComponent>
    </Structure>
  );
}

export default  Dashboard;