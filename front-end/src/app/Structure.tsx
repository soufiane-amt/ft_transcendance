"use client";

import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React from "react";
import '../styles/TailwindRef.css'



const Structure = ({ children }: { children: React.ReactNode }) => {

  return (
    <main className="w-[100vw] h-[100vh] overflow-auto">
      {/* <NavBar /> */}
      <div className="h-[91px] bg-white w-full">this is nav</div>
      {children}
    </main>
  );
};

export default withAuth(Structure);

