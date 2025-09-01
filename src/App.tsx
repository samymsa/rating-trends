import { useEffect, useState } from "react";
import { RatingsChart } from "./components/ratings-chart";
import { Button } from "./components/ui/button";
import { Rating, RatingButton } from "./components/ui/shadcn-io/rating";

function getPlaceName(url: string): string {
  const match = url.match(/maps\/place\/([^/]+)/);
  return match
    ? decodeURIComponent(match[1].replace(/\+/g, " "))
    : "Unknown Place";
}

function App() {
  const [placeName, setPlaceName] = useState<string>("");

  useEffect(() => {
    async function updatePlaceName() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const newPlaceName = getPlaceName(tab.url || "");
      setPlaceName(newPlaceName);
    }

    updatePlaceName();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">{placeName || "Sample Place"}</h1>

      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold">{(3.5).toLocaleString()}</span>
        <Rating value={3.5} readOnly>
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton className="text-green-500" key={index} size={18} />
          ))}
        </Rating>
        <span className="text-muted-foreground mt-0.5 text-xs">
          Based on {120} reviews
        </span>
      </div>

      <RatingsChart />

      <Button>Load more reviews</Button>
    </>
  );
}

export default App;
