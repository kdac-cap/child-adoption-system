import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const DashboardCharts = ({ stats }) => {
  const data = [
    { name: "Children", value: stats.children },
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Users", value: stats.users },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#0d6efd" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DashboardCharts;
