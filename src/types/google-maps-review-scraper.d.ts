declare module "google-maps-review-scraper" {
  interface Review {
    review_id: string;
    time: {
      published: string;
      last_edited: string;
    };
    author: {
      name: string;
      profile_url: string;
      url: string;
      id: string;
    };
    review: {
      rating: string;
      text: string | null;
      langage: string | null;
    };
    images: {
      id: string;
      url: string;
      size: {
        width: string;
        height: string;
      };
      location: {
        friendly: string;
        lat: string;
        long: string;
      };
      caption: string | null;
    } | null;
    source: string | null;
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
    options?: ScraperOptions
  ): Promise<string>;
}
