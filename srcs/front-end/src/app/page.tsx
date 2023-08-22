import HomeSmallScreensView from "@/components/HomePages/HomeSmallScreensView";
import HomePageNav from "../components/HomePages/HomePageNav"
import HomeMediumScreensView from "@/components/HomePages/HomeMediumScreensView";
import HomeLargeScreensView from "@/components/HomePages/HomeLargeScreensView";

export default function Home() {
  return (
    <div className="bg-[#0D0149] overflow-hidden w-full h-full">
      <HomePageNav />
      <main className="w-full h-[88%]">
        <HomeSmallScreensView />
        <HomeMediumScreensView />
        <HomeLargeScreensView />
      </main>
    </div>
  );
}

// TODO:
// split repeated components 
// change the animation of buttons in large screen navbar
// start working on about and history pages