import HomePageNav from "../components/HomePage/HomePageNav"

export default function Home() {
  return (
    <div className="bg-black overflow-hidden w-full h-full">
      <HomePageNav />
      <main className="w-full overflow-auto">
        <h2 className="text-white text-center mt-[50px] font-bold">Retro</h2>
        <h2 className="text-white text-center font-bold">Ping Pong</h2>
      </main>
    </div>
  );
}

// bg-[#0D0149]


// TODO: search how to import fonts from google fonts using react13 tailwindcss
// build home pages responsive for mobile