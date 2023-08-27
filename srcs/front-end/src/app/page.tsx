import HomeSmallScreensView from "@/components/HomePages/HomeSmallScreensView";
import HomePageNav from "../components/HomePages/HomePageNav"
import HomeMediumScreensView from "@/components/HomePages/HomeMediumScreensView";
import HomeLargeScreensView from "@/components/HomePages/HomeLargeScreensView";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HomePageNav />
      <main className="bg-[#0D0149] w-full h-[calc(100%-105px)] overflow-auto">
        <HomeSmallScreensView />
        <HomeMediumScreensView />
        <HomeLargeScreensView />
      </main>
    </div>
  );
}

// TODO: start learning : node, express, nest , postgreSQL and orm (prisma)
// TODO: start working in ATH
// TODO: start working in 2fa
// TODO: focus on animations and user experience 
// headers size hisory about