import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function SignInForm() {
  const [error, _setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          const response = await fetch("http://54.226.6.254:8000/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Signin failed");
          }
          localStorage.setItem("token", data.token);
          alert("Signin successful!");
          navigate("/user/dashboard");
          resetForm();
        } catch (error: any) {
          alert(`Error: ${error.message}`);
        } finally {
          setSubmitting(false);
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
        <div className="text-right mt-2">
          <button
            type="button"
            className="text-sm text-purple-600 hover:underline"
            onClick={() => navigate("/user/forgotpassword")}
          >
            Forgot Password?
          </button>
        </div>
      </Form>
    </Formik>
  );
}
