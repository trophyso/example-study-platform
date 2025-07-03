"use client"

import { Area, AreaChart, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface Props {
    data: { [x: string]: string | number }[];
    xAxisKey: string;
    yAxes: {
        key: string;
        stroke: string;
        fill: string;
    }[];
    chartConfig: ChartConfig;
    tickFormatter?: (value: string) => string;
    height?: number;
}

export function AreaChartLinearGradient({
    data,
    xAxisKey,
    yAxes,
    chartConfig,
    tickFormatter = (value) => value.slice(0, 3),
    height = 150
}: Props) {
    return (
        <ChartContainer config={chartConfig} className={`min-h-[${height}px] h-[${height}px] w-full`}>
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <XAxis
                    dataKey={xAxisKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={tickFormatter}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                />
                <defs>
                    {yAxes.map((yAxis) => (
                        <linearGradient key={yAxis.key} id={yAxis.key} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor={yAxis.fill}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={yAxis.fill}
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    ))}
                </defs>
                {yAxes.map((yAxis) => (
                    <Area
                        key={yAxis.key}
                        dataKey={yAxis.key}
                        type="linear"
                        fill={`url(#${yAxis.key})`}
                        stroke={yAxis.stroke}
                        stackId={yAxis.key}
                        dot={{
                            fill: yAxis.fill,
                        }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </AreaChart>
        </ChartContainer>
    )
}
