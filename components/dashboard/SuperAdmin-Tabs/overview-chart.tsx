"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

interface OverviewChartProps {
  className?: string;
}

export function OverviewChart({ className }: OverviewChartProps) {
  return (
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#fff"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                opacity={0.5}
              />
              <YAxis
                stroke="#fff"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                opacity={0.5}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-white/50"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
