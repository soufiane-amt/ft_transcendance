import AboutSmallScreensView from "@/components/HomePages/AboutSmallScreensView";
import HomePageNav from "../../components/HomePages/HomePageNav";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HomePageNav />
      <main className="bg-[#0D0149] w-full h-[88%] overflow-auto">
        <AboutSmallScreensView />
      </main>
    </div>
  );
}
