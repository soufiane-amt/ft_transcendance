"use client";
import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import NavBar from "@/components/GlobalComponents/ProfileNavBar/NavBar";
import React from "react";

const Structure = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      {/* <NavBar /> */}
      {children}
    </main>
  );
};

export default withAuth(Structure);


// note some navbar styles are in Dashboard.css