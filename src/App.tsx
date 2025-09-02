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

    setReviewsState((prev) => ({
      reviews: [...prev.reviews, ...reviewsData],
      nextPage: nextPageData,
    }));
  }

  return (
    <>
      <PlaceName />
      <AverageRating reviews={reviews} />
      <RatingsChart reviews={reviews} />

      <Button onClick={() => fetchReviews(nextPage)}>
        Load 10 More Reviews
      </Button>
    </>
  );
}

export default App;
