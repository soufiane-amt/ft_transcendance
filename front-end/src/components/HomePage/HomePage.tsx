"use client";
import { useEffect, useState } from "react";
import MobileView from "./MobileView";
import MediumView from "./MediumView";
import LargeView from "./LargeView";

export default function HomePage() {
  const [WindowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (WindowWidth >= 0 && WindowWidth <= 640) return <MobileView />;
  else if (WindowWidth > 640 && WindowWidth <= 1536) return <MediumView />;
  else if (WindowWidth > 1536) return <LargeView />;
}
