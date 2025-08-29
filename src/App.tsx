import type { Review } from "google-maps-review-scraper";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

function getPlaceName(url: string): string {
  const match = url.match(/maps\/place\/([^/]+)/);
  return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "Unknown Place";
}

function App() {
  const [placeName, setPlaceName] = useState<string>("");

  useEffect(() => {
    async function updatePlaceName() {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const newPlaceName = getPlaceName(tab.url || "");
      setPlaceName(newPlaceName);
    }

    updatePlaceName();
  }, []);

  useEffect(() => {
    async function updateRatingChart() {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const reviews: Review[] = await chrome.runtime.sendMessage({ type: "GET_REVIEWS", url: tab.url });
      
      console.log("reviews:", reviews);
    }

    updateRatingChart();
  }, []);

  return (
    <>
      <h1>
        {placeName}
      </h1>

      <canvas id="ratingChart"> </canvas>

      <Button>Load more reviews</Button>
    </>
  )
} 

export default App