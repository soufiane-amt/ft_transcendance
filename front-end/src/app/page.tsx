"use client";
import "../styles/Homepage.css";
import HomePage from "@/components/HomePage/HomePage";
import HomePageNav from "@/components/HomePage/HomePageNav";

export default function Home() {
  return (
    <div className="bg-[#0D0149] w-full h-full overflow-y-scroll">
      <HomePageNav />
      <main className="w-full z-0 ">
        <HomePage />
      </main>
    </div>
  );
}
