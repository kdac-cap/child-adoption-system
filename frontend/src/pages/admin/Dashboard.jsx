import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { getData } from "../../utils/localStorageAPI";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#ffc107", "#198754", "#dc3545"];

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [overviewChartData, setOverviewChartData] = useState([]);

  useEffect(() => {
    const users = getData("users") || [];
    const children = getData("children") || [];
    const adoptions = getData("adoptions") || [];

    const pending = adoptions.filter(r => r.status === "Pending").length;
    const approved = adoptions.filter(r => r.status === "Approved").length;
    const rejected = adoptions.filter(r => r.status === "Rejected").length;

    setStats([
      { title: "Children", value: children.length, color: "primary" },
      { title: "Pending", value: pending, color: "warning" },
      { title: "Approved", value: approved, color: "success" },
      { title: "Users", value: users.length, color: "info" },
    ]);

    setStatusChartData([
      { name: "Pending", value: pending },
      { name: "Approved", value: approved },
      { name: "Rejected", value: rejected },
    ]);

    setOverviewChartData([
      { name: "Users", count: users.length },
      { name: "Children", count: children.length },
      { name: "Requests", count: adoptions.length },
    ]);
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3 mb-3">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="row">
        {/* ---- PIE CHART ---- */}
        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5 className="text-center mb-3">Adoption Status</h5>

            {/* FIXED HEIGHT CONTAINER */}
            <div style={{ width: "100%", height: 300 }}>
              <PieChart width={400} height={300}>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusChartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>

        {/* ---- BAR CHART ---- */}
        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5 className="text-center mb-3">System Overview</h5>

            {/* FIXED HEIGHT CONTAINER */}
            <div style={{ width: "100%", height: 300 }}>
              <BarChart
                width={400}
                height={300}
                data={overviewChartData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0d6efd" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
