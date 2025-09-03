"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Review } from "google-maps-review-scraper";

export const description = "A line chart";

const chartConfig = {
  rating: {
    label: "Rating",
    color: "var(--chart-1)",
  },
  average: {
    label: "Average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function getFixedRangeAverages(reviews: Review[], numRanges = 5) {
  if (!reviews) {
    return [];
  }

  const minTime = Math.min(...reviews.map((r) => r.time.last_edited / 1000));
  const maxTime = Math.max(...reviews.map((r) => r.time.last_edited / 1000));
  const rangeSize = (maxTime - minTime) / numRanges;

  const ranges = Array.from({ length: numRanges }, (_, i) => ({
    start: minTime + i * rangeSize,
    end: minTime + (i + 1) * rangeSize,
    ratings: [] as number[],
  }));

  reviews.forEach((review) => {
    const reviewTime = review.time.last_edited / 1000;
    const rangeIndex = Math.min(
      Math.floor((reviewTime - minTime) / rangeSize),
      numRanges - 1,
    );
    ranges[rangeIndex].ratings.push(review.review.rating);
  });

  return ranges
    .map((range) => ({
      time: (range.start + range.end) / 2,
      average:
        range.ratings.length > 0
          ? parseFloat(
              (
                range.ratings.reduce((sum, rating) => sum + rating, 0) /
                range.ratings.length
              ).toFixed(1),
            )
          : null,
    }))
    .filter((point) => point.average !== null);
}

function prepareChartData(reviews: Review[]) {
  const reviewsData = reviews.map((review) => {
    return {
      time: review.time.last_edited / 1000, // Convert from microseconds to milliseconds
      rating: review.review.rating,
      average: null as number | null,
    };
  });

  const averagesData = getFixedRangeAverages(reviews, 5).map((point) => ({
    ...point,
    rating: null as number | null,
  }));

  return averagesData.concat(reviewsData);
}

export function RatingsChart({ reviews }: { reviews: Review[] }) {
  const chartData = prepareChartData(reviews);

  return (
    <ChartContainer config={chartConfig} className="my-4">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          domain={["auto", "auto"]}
          type="number"
          name="Time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString(undefined, {
              year: "2-digit",
              month: "short",
            })
          }
        />
        <YAxis
          dataKey="rating"
          domain={[0, 6]}
          type="number"
          name="Rating"
          tickLine={false}
          axisLine={false}
          tickMargin={32}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_, [{ payload }]) => {
                return new Date(payload.time).toLocaleDateString(undefined, {
                  year: "2-digit",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
          }
        />
        <Line
          dataKey="rating"
          stroke="var(--color-rating)"
          strokeWidth={0}
          dot={{
            fill: "var(--color-rating)",
          }}
          isAnimationActive={false}
        />
        <Line
          dataKey="average"
          type="natural"
          stroke="var(--color-average)"
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
