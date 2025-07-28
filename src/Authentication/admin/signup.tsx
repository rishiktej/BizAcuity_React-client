import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function AdminSignUpForm() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(2, "Too short").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-orange-300 to-orange-500">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              const response = await fetch(
                "http://34.227.75.19:8000/admin/signup",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                }
              );

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Admin signup failed");
              }

              alert("Admin signup successful!");
              resetForm();
              navigate("/admin/dashboard");
            } catch (error: any) {
              alert(`Error: ${error.message}`);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form className="space-y-4">
            <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
              Admin Sign Up
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Field
                type="text"
                name="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="text-red-500 text-sm mt-1">
                <ErrorMessage name="username" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="text-red-500 text-sm mt-1">
                <ErrorMessage name="email" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Field
                type="password"
                name="password"
                autoComplete="new-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="text-red-500 text-sm mt-1">
                <ErrorMessage name="password" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition duration-200"
            >
              Admin Sign Up
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
