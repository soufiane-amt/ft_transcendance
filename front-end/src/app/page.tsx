import HomePage from "@/components/HomePage/HomePage";
import HomePageNav from "../components/HomePage/HomePageNav";

export default function Home() {
  return (
    <div className="w-full h-full overflow-y-auto">
      <HomePageNav />
      <main className="w-full z-0">
        <HomePage />
      </main>
    </div>
  );
}
