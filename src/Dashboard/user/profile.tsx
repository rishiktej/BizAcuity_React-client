import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://34.227.75.19:8000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          username: data.username || "",
          email: data.email || "",
          password: "",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://34.227.75.19:8000/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      alert("Profile updated successfully.");
      setEditMode(false);
    } else {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-600 mb-6">
          My Profile
        </h2>

        {!editMode ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Username
              </label>
              <p className="p-2 border rounded bg-gray-100 text-gray-700">
                {user.username}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>
              <p className="p-2 border rounded bg-gray-100 text-gray-700">
                {user.email}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:underline text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setUser((prev) => ({ ...prev, password: "" }));
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
