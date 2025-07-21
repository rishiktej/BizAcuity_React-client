// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-300 text-gray-800">
      {/* Header */}
      <header className="p-6 flex justify-between items-center shadow-md bg-white bg-opacity-60 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-blue-700">MyDecor App</h1>
        <nav>
          <button
            onClick={() => navigate("/admin/signin")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all mr-3"
          >
            Sign In as Admin
          </button>
          <button
            onClick={() => navigate("/user")}
            className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-100 transition-all"
          >
            Sign In as User
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
          Welcome to MyDecor
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
          Design, decorate, and manage your space like never before. Whether
          you're a user looking to visualize your ideas or an admin managing
          multiple templates, MyDecor has you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/user")}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all"
          >
            Get Started as User
          </button>
          <button
            onClick={() => navigate("/admin/signin")}
            className="px-6 py-3 bg-white text-blue-700 border border-blue-600 rounded-full shadow-md hover:bg-blue-100 transition-all"
          >
            Admin Dashboard
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white bg-opacity-80 mt-12 py-12 px-6 text-center">
        <h3 className="text-2xl font-semibold mb-6 text-blue-700">
          Key Features
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h4 className="font-bold text-blue-600 mb-2">
              Template Management
            </h4>
            <p>
              Save, view, and edit personalized templates with drag-and-drop
              interface.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-blue-600 mb-2">Admin Control</h4>
            <p>
              View all user templates, manage accounts, and track activity with
              insightful dashboards.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-blue-600 mb-2">Secure Sign-In</h4>
            <p>
              Role-based authentication with JWT tokens to ensure your data
              stays safe.
            </p>
          </div>
        </div>
      </section>

      {/* About + License Footer */}
      <footer className="mt-auto bg-white bg-opacity-70 py-6 text-sm text-center text-gray-600">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">
            <strong>About:</strong> MyDecor is an innovative platform to design
            interior spaces interactively with templates and user-friendly
            tools.
          </p>
          <p className="mb-2">
            <strong>License:</strong> © 2025 MyDecor Inc. All rights reserved.
            This application is licensed under MIT.
          </p>
          <p>Made with ❤️ using React, Tailwind CSS, and Node.js.</p>
        </div>
      </footer>
    </div>
  );
}
