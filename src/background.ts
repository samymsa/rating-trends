import { type Review } from "google-maps-review-scraper";
import parseReviews from "google-maps-review-scraper/src/parser";
import { SortEnum } from "google-maps-review-scraper/src/types";
import { fetchReviews } from "google-maps-review-scraper/src/utils";

// Only enable extension on https://www.google.*/maps/place/*
const rule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostContains: ".google.", pathPrefix: "/maps/place/" },
    }),
  ],
  actions: [new chrome.declarativeContent.ShowAction()],
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
});

export type GetReviewsResponse = {
  reviews: Review[];
  nextPage: string;
};

async function getReviews(
  url: string,
  nextPage: string = "",
  sort: keyof typeof SortEnum = "newest",
): Promise<GetReviewsResponse> {
  const dotComUrl = url.replace(/google(\.[a-z]{2,3}){1,2}/, "google.com");

  const [, rawNextPage, rawReviews] = await fetchReviews(
    dotComUrl,
    SortEnum[sort],
    nextPage,
  );

  const cleanedData = await parseReviews(rawReviews);
  const newNextPage = rawNextPage?.replace(/"/g, "");
  const reviews = JSON.parse(cleanedData) as Review[];
  console.log("Fetched reviews:", reviews);
  console.log("Next page token:", newNextPage);

  return {
    reviews,
    nextPage: newNextPage || "",
  };
}

chrome.runtime.onMessage.addListener(
  ({ type, url, nextPage }, _sender, sendResponse) => {
    if (type === "GET_REVIEWS") {
      getReviews(url, nextPage)
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
          sendResponse({ error: error.message });
        });
    }

    return true; // Indicates that the response will be sent asynchronously
  },
);
