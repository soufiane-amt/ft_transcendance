"use client";

import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React from "react";


const Structure = ({ children }: { children: React.ReactNode }) => {

  // create socket
  return (
    <main>
      <NavBar />
      {/* <div style={{ height: '91px'}}>this is nav</div> */}
      {children}
    </main>
  );
};

export default withAuth(Structure);

