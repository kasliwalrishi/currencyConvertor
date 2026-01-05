import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useHistoricalCurrencyInfo from '../hooks/useHistoricalCurrencyInfo';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CurrencyGraph({ currency, toCurrency }) {
    // Call our custom hook
    const { data, loading } = useHistoricalCurrencyInfo(currency, toCurrency);

    // Chart Configuration
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 13,
                        weight: 'bold',
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            title: {
                display: true,
                text: `${currency.toUpperCase()} to ${toCurrency.toUpperCase()} Exchange Rate - 15 Year History`,
                color: 'rgb(255, 255, 255)',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                padding: 25,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                padding: 15,
                displayColors: true,
                boxPadding: 8,
                callbacks: {
                    title: function(context) {
                        return `Date: ${context[0].label}`;
                    },
                    label: function(context) {
                        return `1 ${currency.toUpperCase()} = ${context.parsed.y.toFixed(4)} ${toCurrency.toUpperCase()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.15)',
                    drawBorder: true,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                ticks: {
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 12,
                        weight: '500',
                    },
                    maxTicksLimit: 10,
                    maxRotation: 45,
                    minRotation: 0,
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 14,
                        weight: 'bold',
                    }
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(255, 255, 255, 0.15)',
                    drawBorder: true,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                ticks: {
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 12,
                        weight: '500',
                    },
                    callback: function(value) {
                        return value.toFixed(2);
                    },
                    padding: 10,
                },
                title: {
                    display: true,
                    text: `Exchange Rate (in ${toCurrency.toUpperCase()})`,
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 15,
                }
            },
        },
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 bg-white/20 backdrop-blur-md rounded-lg mt-6 border border-white/30 shadow-lg">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-3"></div>
                        <p className="text-white font-semibold text-lg">Loading historical data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data || !data.labels || data.labels.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 bg-white/20 backdrop-blur-md rounded-lg mt-6 border border-white/30 shadow-lg">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-white font-semibold text-lg">📊 No data available</p>
                        <p className="text-white/70 text-sm mt-2">Try converting between different currency pairs</p>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare data for the Line component
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: `1 ${currency.toUpperCase()} = ? ${toCurrency.toUpperCase()}`,
                data: data.datasets[0].data,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderWidth: 4,
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 3,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgb(96, 165, 250)',
                pointHoverBorderWidth: 3,
            },
        ],
    };

    return (
        <div className="w-full px-4 py-8">
            <div className="w-full max-w-6xl mx-auto p-8 bg-gradient-to-br from-white/25 via-white/15 to-white/20 backdrop-blur-lg rounded-2xl border border-white/40 shadow-2xl">
                {/* Header Info */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-white/80 text-sm uppercase tracking-wide font-semibold">Exchange Rate Chart</p>
                            <p className="text-white text-xs mt-1">Historical data from 15 years ago to today</p>
                        </div>
                        <div className="bg-blue-500/30 px-4 py-2 rounded-lg border border-blue-400/50">
                            <p className="text-white font-bold text-sm">
                                1 <span className="text-blue-300">{currency.toUpperCase()}</span> = <span className="text-green-300">{toCurrency.toUpperCase()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="relative w-full bg-black/20 rounded-xl p-6 border border-white/20">
                    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
                        <Line options={options} data={chartData} />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-xs px-2">
                    <div className="flex items-center gap-2">
                        <span>📈</span>
                        <p>Exchange rate trend showing 1 {currency.toUpperCase()} value in {toCurrency.toUpperCase()}</p>
                    </div>
                    <p className="text-white/50 text-xs">Data: Frankfurter API</p>
                </div>
            </div>
        </div>
    );
}

export default CurrencyGraph;