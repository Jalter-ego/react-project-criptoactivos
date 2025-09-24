import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

type Trade = {
  price: number;
  time: number;
};

export default function LiveAreaChart() {
  const [data, setData] = useState<Trade[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("trade", (trade: Trade) => {
      setData((prev) => {
        const newData = [...prev, { ...trade, time: Date.now() }];
        return newData.slice(-100); // mantener solo los últimos 100 puntos
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tickFormatter={(t) => new Date(t).toLocaleTimeString()}
        />
        <YAxis domain={["auto", "auto"]}/>
        <Tooltip
          labelFormatter={(t) => new Date(Number(t)).toLocaleTimeString()}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorPrice)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
