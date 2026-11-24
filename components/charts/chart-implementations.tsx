"use client"

import type { ChartDataPoint } from "./types"

type Options = {
  color?: string | string[]
  colors?: string[]
  stack?: boolean
  height?: number
  showLegend?: boolean
}

function SimpleChart({
  data,
  label,
}: {
  data: ChartDataPoint[]
  label: string
}) {
  return <div data-chart={label}>{data.length} points</div>
}

export function BarChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="bar" />
}

export function GroupedBarChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="grouped-bar" />
}

export function StackedBarChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="stacked-bar" />
}

export function HorizontalBarChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="horizontal-bar" />
}

export function LineChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="line" />
}

export function AreaChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="area" />
}

export function DonutChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="donut" />
}

export function PieChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Options
}) {
  return <SimpleChart data={data} label="pie" />
}
