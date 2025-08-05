import { useState } from "react";

export default function NewsletterSender() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

  const handleSend = async () => {
    if (!subject || !content) {
      setStatus("Please fill in all fields.");
      return;
    }

    setStatus("Sending...");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/send-newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },

        body: JSON.stringify({ subject, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send newsletter");
      }

      setStatus("✅ Newsletter sent successfully!");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send newsletter.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Send Newsletter</h2>

      <input
        type="text"
        placeholder="Subject"
        className="w-full p-2 border rounded mb-4"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        placeholder="Newsletter content (HTML allowed)"
        className="w-full p-2 border rounded mb-4 h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Newsletter
      </button>

      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
