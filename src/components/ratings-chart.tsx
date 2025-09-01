"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305, scatter: 98 },
  { month: "March", desktop: 237, scatter: 126 },
  { month: "April", desktop: 73, scatter: 87 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  scatter: {
    label: "Scatter",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RatingsChart() {
  return (
    <ChartContainer config={chartConfig} className="my-4">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="scatter"
          type="natural"
          stroke="transparent"
          strokeWidth={2}
          dot={{
            fill: "var(--color-desktop)",
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
