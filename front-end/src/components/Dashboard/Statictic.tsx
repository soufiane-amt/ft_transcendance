"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Cookies from "js-cookie";
import GameStatistics from "./interfaces/GameStatistics";

interface Data {
  date: string;
  win: number;
  lose: number;
}

function Statictic() {
  const [statistic, setstatistic] = useState<GameStatistics[] | []>([]);
  let data: Data[] = [];
  const JwtToken = Cookies.get("access_token");

  function CheckDuplicateDates(array: Data[]) {
    const dateMap = new Map<string, { win: number; lose: number }>();

    for (const item of array) {
      if (dateMap.has(item.date)) {
        const existing = dateMap.get(item.date)!;
        existing.win += item.win;
        existing.lose += item.lose;
      } else {
        dateMap.set(item.date, { win: item.win, lose: item.lose });
      }
    }

    const aggregatedData: Data[] = [];
    dateMap.forEach((stats, date) => {
      aggregatedData.push({ date, ...stats });
    });

    return aggregatedData;
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/api/Dashboard/statistic`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data: any) => {
        setstatistic(data);
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
      });
  }, [JwtToken]);
  data = statistic.map((statistic: GameStatistics) => {
    const result = statistic.result.split("-");
    const date = statistic.createdAt.split("-");
    return {
      date: `${date[0]}-${date[1]}-${date[2].slice(0, 2)}`,
      win: result[0] > result[1] ? 1 : 0,
      lose: result[0] < result[1] ? 1 : 0,
    };
  }, []);
  const duplicateDates = CheckDuplicateDates(data);
  return (
    <div className="Statistic">
      <div className="statistic-diagram">
        <div className="chart-container">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                width={1110}
                height={300}
                data={duplicateDates}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#FFF" />
                <XAxis dataKey="date" stroke="#FFF" />
                <YAxis stroke="#FFF" />
                <Tooltip />
                <Legend stroke="#FFF" />
                <Line
                  type="monotone"
                  dataKey="win"
                  stroke="#19CC05"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="lose" stroke="#BE263B" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statictic;
