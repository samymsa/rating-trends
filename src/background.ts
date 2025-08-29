import { scraper } from "google-maps-review-scraper";

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

async function getReviews(url: string) {
  const dotComUrl = url.replace(/google(\.[a-z]{2,3}){1,2}/, "google.com");

  const rawReviews = await scraper(dotComUrl, {
    sort_type: "newest",
    clean: true,
    pages: 1,
  });

  const reviews = JSON.parse(rawReviews);

  return reviews;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_REVIEWS") {
    getReviews(message.url)
      .then((reviews) => {
        sendResponse({ reviews });
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        sendResponse({ error: error.message });
      });
  }

  return true; // Indicates that the response will be sent asynchronously
});
