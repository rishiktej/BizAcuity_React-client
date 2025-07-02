import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function SignInForm() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const stored = localStorage.getItem("userCreds");

        if (stored) {
          const user = JSON.parse(stored);
          if (
            user.email === values.email &&
            user.password === values.password
          ) {
            setError("");
            navigate("/dashboard");
          } else {
            setError("Invalid email or password.");
          }
        } else {
          setError("No account found. Please sign up first.");
        }
      }}
    >
      <Form className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Field
            type="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="text-red-500 text-sm mt-1">
            <ErrorMessage name="email" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Field
            type="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="text-red-500 text-sm mt-1">
            <ErrorMessage name="password" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
        >
          Sign In
        </button>
      </Form>
    </Formik>
  );
}
