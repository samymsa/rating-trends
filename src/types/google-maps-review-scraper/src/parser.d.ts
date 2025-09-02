declare module "google-maps-review-scraper/src/parser" {
  /**
   * Parses an array of reviews and returns a minified JSON string of the parsed reviews.
   * @param reviews - The array of reviews to parse. Each review is expected to be an array with specific nested structures.
   * @returns A promise that resolves to a JSON string of the parsed reviews.
   */
  export default function parseReviews(reviews: unknown[]): Promise<string>;
}
