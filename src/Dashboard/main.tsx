import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface TemplateData {
  _id: string;
  widthInput: number;
  heightInput: number;
  unit: string;
  bgColor: string;
  bgImg: string | null;
  images: any[];
  lastEdited?: string;
}
export default function Dashboard() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateData[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/templates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTemplates(data || []);
    };

    fetchTemplates();
  }, []);

  const deleteTemplate = async (id: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/templates/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setTemplates((prev) => prev.filter((template) => template._id !== id));
    } else {
      alert("Failed to delete template");
    }
  };

  const loadTemplate = (template: TemplateData) => {
    navigate("/create", {
      state: {
        loadSaved: true,
        template,
      },
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-purple-600">Dashboard</h2>
          <button
            onClick={() => alert("Profile Clicked")}
            className="w-full text-left py-2 px-3 rounded hover:bg-purple-100 text-gray-700"
          >
            Profile
          </button>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Your Templates</h1>
          <button
            onClick={() => navigate("/create", { state: { loadSaved: false } })}
            className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
          >
            + Create New
          </button>
        </div>
        <hr className="my-4" />
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Saved Templates
        </h3>
        <div className="space-y-2">
          {templates.length === 0 && (
            <p className="text-sm text-gray-500">No templates found.</p>
          )}
          {templates.map((template, index) => (
            <div
              key={template._id}
              className="border p-2 rounded bg-gray-50 hover:bg-gray-100"
            >
              <div className="text-xs text-gray-600">Template #{index + 1}</div>
              <button
                onClick={() => loadTemplate(template)}
                className="mt-1 w-full bg-purple-500 text-white py-1 rounded text-sm hover:bg-purple-600"
              >
                Load
              </button>
              <button
                onClick={() => deleteTemplate(template._id)}
                className="text-red-500 hover:text-red-700 transition"
                title="Delete Template"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
