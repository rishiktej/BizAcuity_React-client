import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TemplateData {
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
    const stored = localStorage.getItem("saved_template");
    if (stored) {
      const parsed = JSON.parse(stored);
      const withDate = {
        ...parsed,
        lastEdited: new Date().toISOString().split("T")[0],
      };
      setTemplates([withDate]); // currently supports only 1 template
    }
  }, []);

  const handleSignOut = () => {
    // Clear user session/token if needed
    console.log("Signed out");
    navigate("/"); // Redirect to login or home
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.length === 0 ? (
            <p className="text-gray-500">No templates found.</p>
          ) : (
            templates.map((template, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                onClick={() =>
                  navigate("/create", { state: { loadSaved: true } })
                } // or /editor/:id if you support multiple
              >
                <h3 className="text-lg font-medium mb-2">
                  Template {index + 1}
                </h3>
                <p className="text-sm text-gray-600">
                  {template.widthInput} x {template.heightInput} {template.unit}
                </p>
                <div
                  className="mt-2 w-full h-24 rounded border border-gray-200 bg-center bg-cover"
                  style={{
                    backgroundColor: template.bgColor,
                    backgroundImage: template.bgImg
                      ? `url(${template.bgImg})`
                      : "none",
                  }}
                ></div>
                <p className="text-xs text-gray-500 mt-2">
                  Last edited: {template.lastEdited}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
