import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ffc107", "#198754", "#dc3545"];

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [overviewChartData, setOverviewChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const users = getData("users") || [];
      const children = getData("children") || [];
      const adoptions = getData("adoptions") || [];

      const pending = adoptions.filter((r) => r.status === "Pending").length;
      const approved = adoptions.filter((r) => r.status === "Approved").length;
      const rejected = adoptions.filter((r) => r.status === "Rejected").length;

      setStats([
        { title: "Total Users", value: users.length, color: "primary" },
        { title: "Total Children", value: children.length, color: "info" },
        { title: "Pending Requests", value: pending, color: "warning" },
        { title: "Approved", value: approved, color: "success" },
        { title: "Rejected", value: rejected, color: "danger" },
      ]);

      setStatusChartData([
        { name: "Pending", value: pending, fill: COLORS[0] },
        { name: "Approved", value: approved, fill: COLORS[1] },
        { name: "Rejected", value: rejected, fill: COLORS[2] },
      ]);

      setOverviewChartData([
        { name: "Users", count: users.length },
        { name: "Children", count: children.length },
        { name: "Requests", count: adoptions.length },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="mb-4 fw-bold">📊 Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-6 col-sm-4 col-md-2">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="row g-2 g-md-3">
        {/* ---- PIE CHART ---- */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body p-2 p-md-3">
              <h6 className="card-title mb-3 fs-6">📈 Adoption Status Distribution</h6>
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
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
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">No data available</div>
              )}
            </div>
          </div>
        </div>

        {/* ---- BAR CHART ---- */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body p-2 p-md-3">
              <h6 className="card-title mb-3 fs-6">📊 System Overview</h6>
              {overviewChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={overviewChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0d6efd" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
