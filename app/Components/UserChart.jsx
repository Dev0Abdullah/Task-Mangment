// UserChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// تسجيل العناصر المطلوبة
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function UserChart({ projectData }) {
  const data = {
    labels: ["Total", "Ended", "Running", "Pending"],
    datasets: [
      {
        label: "Projects Count",
        data: [
          projectData.total,
          projectData.ended,
          projectData.running,
          projectData.pending,
        ],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white rounded-lg p-5 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Project Status</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default UserChart;
