"use client";

import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React, { useEffect } from "react";
import '../styles/TailwindRef.css'
import newSocket from "@/components/GlobalComponents/Socket/socket";




const Structure = ({ children }: { children: React.ReactNode }) => {

  useEffect(() => {
    newSocket.on('GameInvitation', (data) => {
      if(data)
        console.log(data);
    });
  });
  return (
    <main>
      <NavBar />  
      {/* <div className="h-[91px] bg-white w-full">this is nav</div> */}
      {children}
    </main>
  );
};

export default withAuth(Structure);

