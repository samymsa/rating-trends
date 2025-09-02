import { useEffect, useState } from "react";
import type { GetReviewsResponse } from "./background";
import { AverageRating } from "./components/AverageRating";
import { PlaceName } from "./components/PlaceName";
import { RatingsChart } from "./components/RatingsChart";
import { Button } from "./components/ui/button";

function App() {
  const [{ reviews, nextPage }, setReviewsState] = useState<GetReviewsResponse>(
    {
      reviews: [],
      nextPage: "",
    },
  );

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews(pageToken: string = "") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const { reviews: reviewsData, nextPage: nextPageData }: GetReviewsResponse =
      await chrome.runtime.sendMessage({
        type: "GET_REVIEWS",
        url: tab.url,
        nextPage: pageToken,
      });

    setReviewsState((prev) => {
      // Use an object keyed by timestamp for deduplication
      const reviewMap: { [timestamp: number]: (typeof reviewsData)[0] } = {};
      for (const review of [...prev.reviews, ...reviewsData]) {
        reviewMap[review.time.published] = review;
      }
      return {
        reviews: Object.values(reviewMap),
        nextPage: nextPageData,
      };
    });
  }

  return (
    <div className="space-y-2">
      <PlaceName />
      <AverageRating reviews={reviews} />
      <RatingsChart reviews={reviews} />

      <Button onClick={() => fetchReviews(nextPage)}>
        Load 10 More Reviews
      </Button>
    </div>
  );
}

export default App;
