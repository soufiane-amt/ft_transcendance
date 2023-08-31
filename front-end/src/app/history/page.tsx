import HomePageNav from "../../components/HomePages/HomePageNav";
import HistorySmallScreenView from "@/components/HomePages/HistorySmallScreenView";
import HistoryLargeScreenView from "@/components/HomePages/HistoryLargeScreenView";
import HistoryMediumScreenView from "@/components/HomePages/HistoryMediumScreenView";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HomePageNav />
      <main className="bg-[#EFECFF] w-full h-[calc(100%-105px)] overflow-auto">
        <HistorySmallScreenView />
        <HistoryMediumScreenView />
        <HistoryLargeScreenView />
      </main>
    </div>
  );
}
