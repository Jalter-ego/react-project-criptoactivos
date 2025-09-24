import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Chart from 'chart.js/auto';

interface Trade {
  price: string;
  amount: string;
  timestamp: string;
}

const TradingChart: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const socketRef = React.useRef<Socket | null>(null);
  const chartRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartInstance = React.useRef<Chart | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000'); // URL de tu backend NestJS

    socketRef.current.on('trade', (trade: Trade) => {
      setTrades(prev => [...prev.slice(-50), trade]); // Guardamos solo los últimos 50 trades
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: trades.map(t => new Date(parseInt(t.timestamp) * 1000).toLocaleTimeString()),
          datasets: [{
            label: 'BTC/USD',
            data: trades.map(t => parseFloat(t.price)),
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          }]
        },
        options: {
          responsive: true,
          animation: false,
          scales: {
            x: { display: true },
            y: { display: true }
          }
        }
      });
    } else {
      chartInstance.current.data.labels = trades.map(t => new Date(parseInt(t.timestamp) * 1000).toLocaleTimeString());
      chartInstance.current.data.datasets[0].data = trades.map(t => parseFloat(t.price));
      chartInstance.current.update('none');
    }
  }, [trades]);

  return <canvas ref={chartRef} />;
};

export default TradingChart;
