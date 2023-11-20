"use client";
import "@/styles/Dashboard.css";
import Structure from "@/app/Structure";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { showToast } from "../../components/Dashboard/ShowToast";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import GameStatistics from "@/components/Dashboard/interfaces/GameStatistics";
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

interface Data {
  date: string;
  win: number;
  lose: number;
}

function Dashboard() {
  const router = useRouter();
  const [name, setname] = useState("");
  const JwtToken = Cookies.get("access_token");
  const [friend, setfriend]: any = useState();
  const [image, setImage] = useState("backgroundrandom.jpg");
  const [statistic, setstatistic] = useState<GameStatistics[] | []>([]);
  let data: Data[] = [];

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
    const url = new URL(`${window.location}`);

    if (url.searchParams.has("username") && url.searchParams.size === 1) {
      const username = url.searchParams.get("username");
      if (username) setname(username);
      else {
        router.push(`/profile/404`);
      }
    } else {
      router.push(`/404`);
    }
    if (name) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/api/profile/${name}`, {
        method: "Get",
        headers: {
          Authorization: `Bearer ${JwtToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status == 400) {
            router.push(`/404`);
          }
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          setfriend(data);
        })
        .catch((error) => {
          router.push(`/chat/DirectMessaging`);
        });
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/api/profile/statistic/${name}`,
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            router.push(`/profile/Error`);
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setstatistic(data);
        })
        .catch((error) => {
          console.clear();
        });
    }
  }, [name]);
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
    <Structure>
      <div className="mybody ">
        <div className="left-bar">
          <div className="head">
            <p>Profile Friend</p>
            <hr></hr>
          </div>
        </div>
        <div className="section-container">
          <div className="section-image">
            <img src={friend?.background || (image as string)} alt="Photo" />
          </div>
          <div className="identification">
            <div className="identification-header one">
              <hr id="section-line"></hr>
              <div className="identification-information">
                <h3>Wins</h3>
                <p>{friend?.wins}</p>
              </div>
              <hr id="section-line"></hr>
              <div className="identification-information">
                <h3>Loss</h3>
                <p>{friend?.losses}</p>
              </div>
            </div>
            <div className="parent-identification-user">
              <div className="identification-user">
                <img
                  src={friend?.avatar}
                  alt="Photo"
                  width={130}
                  height={130}
                />
                <div className="level">
                  <p>{friend?.ladder_level}</p>
                </div>
                <p id="nameuser">{friend?.username}</p>
              </div>
            </div>
            <div className="identification-information">
              <h3>Total Game</h3>
              <p>{friend?.wins + friend?.losses}</p>
            </div>
            <hr id="section-line"></hr>
            <div className="identification-information">
              <h3>Level</h3>
              <p>{friend?.ladder_level}</p>
            </div>
            <hr id="section-line"></hr>
          </div>
        </div>
      </div>
      {/* statistic */}
      <div className="home-page">
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
      </div>
    </Structure>
  );
}

export default Dashboard;
