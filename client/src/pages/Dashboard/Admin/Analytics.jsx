import { useQuery } from "@tanstack/react-query";
//import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Container from "../../../components/Shared/Container";
import Heading from "../../../components/Shared/Heading";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/analytics");
      return data.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <Container>
      <Heading title="Platform Analytics" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {analytics?.totalUsers || 0}
          </p>
        </div>

        <div className="surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Scholarships
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {analytics?.totalScholarShips || 0}
          </p>
        </div>

        <div className="surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Fees Collected
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${analytics?.totalFees || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Bar Chart - Applications per University */}
        <div className="surface rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">
            Applications per University
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.appsPerUniversity || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="_id"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Applications per Category */}
        <div className="surface rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">
            Applications by Scholarship Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.appsPerCategory || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                >
                  {(analytics?.appsPerCategory || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Analytics;
