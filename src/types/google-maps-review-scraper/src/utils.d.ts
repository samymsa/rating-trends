declare module "google-maps-review-scraper/src/utils" {
  /**
   * Fetches reviews from a given URL with sorting and pagination options.
   *
   * @param url - The URL to fetch reviews from.
   * @param sort - The sorting option for the reviews.
   * @param nextPage - Token for the next page, if any.
   * @param search_query - Search query to filter reviews, if any.
   * @returns Parsed JSON data of reviews.
   * @throws If the request fails or the response is invalid.
   */
  export function fetchReviews(
    url: string,
    sort: number,
    nextPage?: string,
    search_query?: string,
  ): Promise<[unknown, string?, unknown[]]>;
}
