"use client"

import { Bar as RechartsBar, BarChart as RechartsBarChart, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface Props {
    data: { [x: string]: string | number }[];
    xAxisKey: string;
    yAxis: {
        key: string;
        stroke: string;
        fill: string;
    };
    chartConfig: ChartConfig;
    tickFormatter?: (value: string) => string;
    height?: number;
}

export function BarChart({
    data,
    xAxisKey,
    yAxis,
    chartConfig,
    tickFormatter = (value) => value.slice(0, 3),
    height = 150
}: Props) {
    return (
        <ChartContainer config={chartConfig} className={`min-h-[${height}px] h-[${height}px] w-full`}>
            <RechartsBarChart accessibilityLayer data={data}>
                <XAxis
                    dataKey={xAxisKey}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={tickFormatter}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <RechartsBar dataKey={yAxis.key} fill={yAxis.fill} radius={8} />
            </RechartsBarChart>
        </ChartContainer>
    );
}
