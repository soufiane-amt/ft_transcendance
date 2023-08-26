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

// TODO:: code home/history/about page with three difffent responsive sizes minimum , handle small height problem it should be scroll , sync one padding - header size etc between all pages, use grid in about contributers , use one component in about contibuters
// TODO: start learning : node, express, nest , postgreSQL and orm (prisma)
// TODO: start working in ATH
// TODO: start working in 2fa