"use client";
import "@/styles/Dashboard.css";
import Structure from "@/app/Structure";
import DisplayComponent from "@/components/Dashboard/DisplayComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  return (
    <div className="mybody">
      <Structure>
        <ToastContainer position="top-center"></ToastContainer>
        <DisplayComponent></DisplayComponent>
      </Structure>
    </div>
  );
}

export default Dashboard;
