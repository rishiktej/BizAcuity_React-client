import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function SignUpForm() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(2, "Too short").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
  });
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          const response = await fetch("http://localhost:8080/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              email: values.email,
              password: values.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Signup failed");
          }

          alert("Signup successful!");
          resetForm();
          navigate("/user/dashboard");
        } catch (error: any) {
          alert(`Error: ${error.message}`);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Field
            type="text"
            name="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="text-red-500 text-sm mt-1">
            <ErrorMessage name="name" />
          </div>
        </div>

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
          Sign Up
        </button>
      </Form>
    </Formik>
  );
}
