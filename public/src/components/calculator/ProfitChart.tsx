import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CalculationResult } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProfitChartProps {
  data: CalculationResult[];
}

export const ProfitChart = ({ data }: ProfitChartProps) => {
  const chartData = {
    labels: data.map((d, index) => `Calc ${index + 1}`),
    datasets: [
      {
        label: "Profit/Loss (₹)",
        data: data.map(d => d.profit),
        fill: true,
        borderColor: "hsl(217 91% 60%)",
        backgroundColor: "hsl(217 91% 60% / 0.1)",
        tension: 0.4,
        pointBackgroundColor: data.map(d => 
          d.profit >= 0 ? "hsl(142 76% 36%)" : "hsl(0 84.2% 60.2%)"
        ),
        pointBorderColor: data.map(d => 
          d.profit >= 0 ? "hsl(142 76% 36%)" : "hsl(0 84.2% 60.2%)"
        ),
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "hsl(0 0% 98%)",
          font: {
            family: "Inter",
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "hsl(240 10% 3.9%)",
        titleColor: "hsl(0 0% 98%)",
        bodyColor: "hsl(0 0% 98%)",
        borderColor: "hsl(217 91% 60%)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const profit = context.raw;
            return `Profit: ₹${profit.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(240 3.7% 15.9%)",
        },
        ticks: {
          color: "hsl(240 5% 64.9%)",
          font: {
            family: "Inter",
            size: 11,
          },
          callback: function(value: any) {
            return "₹" + value.toLocaleString('en-IN');
          },
        },
      },
      x: {
        grid: {
          color: "hsl(240 3.7% 15.9%)",
        },
        ticks: {
          color: "hsl(240 5% 64.9%)",
          font: {
            family: "Inter",
            size: 11,
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Profit Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No data available. Start calculating to see profit trends.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gradient-primary">
          Profit Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};