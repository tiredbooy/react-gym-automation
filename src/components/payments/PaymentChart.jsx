import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Utility to convert numbers to Persian numerals
const toPersianNumeral = (num) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (d) => persianDigits[d]);
};

const PaymentsVisualization = () => {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme] || themes.solara; // Default to solara
  const { primary, secondary, accent, background } = theme.colors;

  // State management
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [chartType1, setChartType1] = useState("bar");
  const [chartType2, setChartType2] = useState("line");

  // Sample payment data
  const paymentData = {
    monthly: {
      labels: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ],
      amounts: [
        12000000, 15000000, 18000000, 17000000, 20000000, 22000000, 19000000,
        21000000, 23000000, 25000000, 24000000, 26000000,
      ],
    },
    yearly: {
      labels: ["۱۴۰۰", "۱۴۰۱", "۱۴۰۲", "۱۴۰۳", "۱۴۰۴"],
      amounts: [150000000, 180000000, 210000000, 240000000, 270000000],
    },
  };

  // Chart data configuration
  const getChartData = (type) => ({
    labels: paymentData[timeFrame].labels,
    datasets: [
      {
        label: "پرداخت‌ها (ریال)",
        data: paymentData[timeFrame].amounts,
        backgroundColor:
          type === "bar" ? `rgba(235, 94, 40, 0.6)` : `rgba(235, 94, 40, 0.2)`, // Solara primary
        borderColor: primary,
        borderWidth: 2,
        hoverBackgroundColor: type === "bar" ? primary : undefined,
        fill: type === "line",
        tension: type === "line" ? 0.4 : undefined,
        pointBackgroundColor: type === "line" ? primary : undefined,
        pointBorderColor: type === "line" ? "#fff" : undefined,
        pointHoverBackgroundColor: type === "line" ? "#fff" : undefined,
        pointHoverBorderColor: type === "line" ? primary : undefined,
      },
    ],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { size: 14, family: "Vazirmatn" }, // Assuming Persian font
          color: secondary,
        },
      },
      tooltip: {
        backgroundColor: background,
        titleColor: primary,
        bodyColor: secondary,
        borderColor: accent,
        borderWidth: 1,
        callbacks: {
          label: (context) =>
            `${toPersianNumeral(
              (context.raw / 1000000).toFixed(1)
            )} میلیون ریال`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: secondary, font: { family: "Vazirmatn" } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: secondary,
          font: { family: "Vazirmatn" },
          callback: (value) =>
            `${toPersianNumeral((value / 1000000).toFixed(1))}M`,
        },
        grid: { color: `rgba(204, 197, 185, 0.2)` }, // Solara secondary
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  // Export data as CSV
  const exportCSV = () => {
    const headers = ["دوره", "مبلغ (ریال)"];
    const rows = paymentData[timeFrame].labels.map((label, i) => [
      label,
      paymentData[timeFrame].amounts[i],
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payments_${timeFrame}.csv`;
    link.click();
  };

  // Summary statistics
  const total =
    paymentData[timeFrame].amounts.reduce((a, b) => a + b, 0) / 1000000;
  const average = total / paymentData[timeFrame].amounts.length;
  const max = Math.max(...paymentData[timeFrame].amounts) / 1000000;

  return (
    <div
      className={`min-h-screen p-6 bg-${background} font-vazir transition-colors duration-300`}
    >
      <div className="mx-auto max-w-7xl">
        <h1
          className={`text-4xl font-extrabold text-${primary} mb-8 animate-fade-in`}
        >
          نمایش بصری پرداخت‌ها
        </h1>

        {/* Controls */}
        <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
          {/* Time Frame Toggle */}
          <div className={`flex rounded-full bg-${secondary} p-1 shadow-md`}>
            {["monthly", "yearly"].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  timeFrame === frame
                    ? `bg-${primary} text-${background}`
                    : `text-${primary} hover:bg-${accent} hover:text-${background}`
                }`}
              >
                {frame === "monthly" ? "ماهانه" : "سالانه"}
              </button>
            ))}
          </div>
          {/* Export Button */}
          <button
            onClick={exportCSV}
            className={`px-6 py-2 rounded-lg bg-${accent} text-${background} hover:bg-${primary} transition-all duration-200 shadow-md`}
          >
            خروجی CSV
          </button>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Chart 1 */}
          <div
            className={`p-6 rounded-2xl shadow-xl bg-${background} animate-slide-up`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold text-${primary}`}>
                نمودار پرداخت‌ها
              </h2>
              <div className={`flex rounded-full bg-${secondary} p-1`}>
                {["bar", "line"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType1(type)}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      chartType1 === type
                        ? `bg-${primary} text-${background}`
                        : `text-${primary} hover:bg-${accent} hover:text-${background}`
                    }`}
                  >
                    {type === "bar" ? "میله‌ای" : "خطی"}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-96">
              {chartType1 === "bar" ? (
                <Bar data={getChartData("bar")} options={chartOptions} />
              ) : (
                <Line data={getChartData("line")} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Chart 2 */}
          <div
            className={`p-6 rounded-2xl shadow-xl bg-${background} animate-slide-up delay-100`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold text-${primary}`}>
                روند پرداخت‌ها
              </h2>
              <div className={`flex rounded-full bg-${secondary} p-1`}>
                {["bar", "line"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType2(type)}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      chartType2 === type
                        ? `bg-${primary} text-${background}`
                        : `text-${primary} hover:bg-${accent} hover:text-${background}`
                    }`}
                  >
                    {type === "bar" ? "میله‌ای" : "خطی"}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-96">
              {chartType2 === "bar" ? (
                <Bar data={getChartData("bar")} options={chartOptions} />
              ) : (
                <Line data={getChartData("line")} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div
          className={`mt-8 p-6 rounded-2xl shadow-xl bg-${background} animate-slide-up delay-200`}
        >
          <h2 className={`text-xl font-semibold text-${primary} mb-6`}>
            آمار کلی
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "مجموع پرداخت‌ها", value: total },
              { label: "میانگین پرداخت‌ها", value: average },
              { label: "بیشترین پرداخت", value: max },
            ].map(({ label, value }) => (
              <div
                key={label}
                className={`p-4 rounded-xl bg-${secondary} text-${background} group relative hover:shadow-lg transition-all duration-200`}
              >
                <p className="text-lg font-medium">{label}</p>
                <p className="text-2xl font-bold">
                  {toPersianNumeral(value.toFixed(1))}M
                </p>
                <span className="absolute top-2 left-2 hidden group-hover:block text-xs text-${accent} bg-${background} p-1 rounded">
                  {toPersianNumeral((value * 1000000).toLocaleString())} ریال
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsVisualization;
