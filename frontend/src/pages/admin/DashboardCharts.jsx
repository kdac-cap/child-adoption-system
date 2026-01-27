import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const DashboardCharts = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No data available for charts
      </div>
    );
  }

  const data = [
    { name: "Children", value: stats.totalChildren || 0 },
    { name: "Pending", value: stats.pendingRequests || 0 },
    { name: "Approved", value: stats.approvedRequests || 0 },
    { name: "Users", value: stats.totalUsers || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
        <Legend />
        <Bar dataKey="value" fill="#0d6efd" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

DashboardCharts.propTypes = {
  stats: PropTypes.shape({
    totalChildren: PropTypes.number,
    pendingRequests: PropTypes.number,
    approvedRequests: PropTypes.number,
    totalUsers: PropTypes.number,
  }).isRequired,
};

DashboardCharts.defaultProps = {
  stats: {},
};

export default DashboardCharts;
