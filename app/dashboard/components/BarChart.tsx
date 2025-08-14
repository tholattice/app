"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartTypes {
  title: string;
  stacked: boolean;
}

const BarChart: React.FC<BarChartTypes> = ({ title, stacked }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: stacked,
      },
      y: {
        stacked: stacked,
      },
    },
  };

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "New",
        data: labels.map(() =>
          faker.datatype.number({ min: -1000, max: 1000 })
        ),
        backgroundColor: "rgb(0,163,108)",
      },
      {
        label: "Reactivations",
        data: labels.map(() =>
          faker.datatype.number({ min: -1000, max: 1000 })
        ),
        backgroundColor: "rgb(4,185,162)",
      },
      {
        label: "Upgrades",
        data: labels.map(() =>
          faker.datatype.number({ min: -1000, max: 1000 })
        ),
        backgroundColor: "rgb(113,218,184)",
      },
      {
        label: "Existing",
        data: labels.map(() =>
          faker.datatype.number({ min: -1000, max: 1000 })
        ),
        backgroundColor: "rgb(86,165,197)",
      },
      {
        label: "Downgrades",
        data: labels.map(() =>
          faker.datatype.number({ min: -1000, max: 1000 })
        ),
        backgroundColor: "rgb(254,166,116)",
      },
      {
        label: "Churn",
        data: labels.map(() =>
          faker.datatype.number({ min: -1000, max: -1000 })
        ),
        backgroundColor: "rgb(229,86,81)",
      },
    ],
  };

  const sampleData = labels.map(() => faker.datatype.number({ max: -1000 }));

  return <Bar options={options} data={data} />;
};

export default BarChart;

// NEW rgb(0,163,108)
// Reactivations rgb(4,185,162)
// Upgrades rgb(113,218,184)
// Existing rgb(86,165,197)
// Downgrades rgb(254,166,116)
// Churn rgb(229,86,81)
