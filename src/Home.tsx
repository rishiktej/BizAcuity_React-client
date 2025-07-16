import { useState } from "react";
import SignInForm from "./Authentication/signin";
import SignUpForm from "./Authentication/signup";

export default function HomePage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>

        {isSignIn ? <SignInForm /> : <SignUpForm />}

        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-purple-600 font-medium hover:underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
