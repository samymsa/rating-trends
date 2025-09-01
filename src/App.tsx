import type { Review } from "google-maps-review-scraper";
import { useEffect, useState } from "react";
import { AverageRating } from "./components/AverageRating";
import { PlaceName } from "./components/PlaceName";
import { RatingsChart } from "./components/RatingsChart";
import { Button } from "./components/ui/button";

function App() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pages, setPages] = useState<number>(1);

  useEffect(() => {
    async function updateRatingChart() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const {
        reviews: reviewsData,
      }: {
        reviews: Review[];
      } = await chrome.runtime.sendMessage({
        type: "GET_REVIEWS",
        url: tab.url,
        pages,
      });

      setReviews(reviewsData || []);
    }

    updateRatingChart();
  }, [pages]);

  return (
    <>
      <PlaceName />
      <AverageRating reviews={reviews} />
      <RatingsChart reviews={reviews} />

      <Button onClick={() => setPages((prev) => prev + 1)}>
        Load 10 More Reviews
      </Button>
    </>
  );
}

export default App;
