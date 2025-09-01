declare module "google-maps-review-scraper" {
  interface Review {
    review_id: string;
    time: {
      published: number; // in microseconds
      last_edited: number;
    };
    author: {
      name: string;
      profile_url: string;
      url: string;
      id: string;
    };
    review: {
      rating: number;
      text: string;
      language: string;
    };
    images: Array<{
      id: string;
      url: string;
      size: {
        width: number;
        height: number;
      };
      location: {
        friendly: string;
        lat: number;
        long: number;
      };
      caption: string | null;
    }> | null;
    source: string;
    response: string | null;
  }

  type ScraperOutput = Review[];

  interface ScraperOptions {
    sort_type?: string;
    clean?: boolean;
    pages?: number;
    [key: string]: unknown;
  }

  export function scraper(
    url: string,
    options?: ScraperOptions,
  ): Promise<string>;
}
