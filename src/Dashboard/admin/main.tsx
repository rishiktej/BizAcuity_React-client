import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [usageData, setUsageData] = useState([
    { day: "Mon", usage: 10 },
    { day: "Tue", usage: 22 },
    { day: "Wed", usage: 15 },
    { day: "Thu", usage: 30 },
    { day: "Fri", usage: 18 },
    { day: "Sat", usage: 24 },
    { day: "Sun", usage: 12 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://34.227.75.19:8000/admin/userscount", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        });
        const data = await res.json();
        console.log(data);
        setTotalUsers(data);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    const fetchtemplateData = async () => {
      try {
        const res = await fetch(
          "http://34.227.75.19:8000/admin/templatescount",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);
        setTotalTemplates(data);
      } catch (error) {
        console.error("Error fetching templates count:", error);
      }
    };

    fetchData();
    fetchtemplateData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("admintoken");
    navigate("/admin/signin");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } p-4`}
      >
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-4">
          {sidebarOpen ? "⬅" : "➡"}
        </button>
        {sidebarOpen && (
          <ul className="space-y-4">
            <li>
              <button onClick={handleSignOut} className="text-red-500">
                Sign Out
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/admin/userslist")}
                className="text-blue-500"
              >
                Users
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/admin/send-newsletter")}
                className="text-blue-500"
              >
                Send News-Letter
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl text-blue-600">{totalUsers}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">Total Templates Created</h2>
            <p className="text-3xl text-green-600">{totalTemplates}</p>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">App Usage (Weekly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
