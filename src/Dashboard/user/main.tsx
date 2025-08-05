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
  const [subscribed, setSubscribed] = useState(false);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const substatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const r = await fetch(`${API_BASE_URL}/subscribe`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const i = await r.json();
        setSubscribed(i);
      } catch {
        alert("unable to fetch sub status");
      }
    };

    substatus();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/templates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tempdata = await res.json();
      setTemplates(Array.isArray(tempdata) ? tempdata : []);
    };

    fetchTemplates();
  }, []);

  const deleteTemplate = async (id: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/templates/${id}`, {
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
    navigate("/user/create", {
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

  const handlesub = async (st: boolean) => {
    const token = localStorage.getItem("token");
    setSubscribed(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/subscribe`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription: st,
        }),
      });
      alert(resp.statusText);
    } catch {
      alert("Failed to subscribe!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-purple-600">Dashboard</h2>
          <button
            onClick={() => navigate("/user/profile")}
            className="w-full text-left py-2 px-3 rounded hover:bg-purple-100 text-gray-700 cursor-pointer"
          >
            Profile
          </button>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition cursor-pointer"
        >
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6 gap-2 flex-wrap">
          <h1 className="text-3xl font-semibold">Your Templates</h1>

          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate("/user/create", { state: { loadSaved: false } })
              }
              className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 cursor-pointer"
            >
              + Create New
            </button>

            <button
              onClick={() => {
                handlesub(true);
              }}
              disabled={subscribed}
              className={`px-5 py-2 rounded text-white transition ${
                subscribed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
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
              className="border p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-xs text-gray-600">Template #{index + 1}</div>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => loadTemplate(template)}
                  className="flex-1 bg-purple-500 text-white py-1 rounded text-sm hover:bg-purple-600 cursor-pointer"
                >
                  Load
                </button>
                <button
                  onClick={() => deleteTemplate(template._id)}
                  className="text-red-500 hover:text-red-700 transition cursor-pointer"
                  title="Delete Template"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
