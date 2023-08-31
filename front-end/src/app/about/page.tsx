import HomePageNav from "../../components/HomePages/HomePageNav";
import AboutSmallScreensView from "@/components/HomePages/AboutSmallScreensView";
import AboutLargeScreensView from "@/components/HomePages/AboutLargeScreensView";
import AboutMediumScreensView from "@/components/HomePages/AboutMediumScreensView";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HomePageNav />
      <main className="bg-[#0D0149] w-full h-[calc(100%-105px)] overflow-auto">
        <AboutSmallScreensView />
        <AboutMediumScreensView />
        <AboutLargeScreensView />
      </main>
    </div>
  );
}
