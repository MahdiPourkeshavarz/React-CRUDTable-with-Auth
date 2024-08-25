import { useState } from "react";
import { AuthenticationForm } from "../components/AuthenticationForm";

export function AuthPage() {
  const [mode, setMode] = useState("login");

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  function onSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
  }

  return (
    <div
      className="flex min-h-screen bg-cover"
      style={{ backgroundImage: "url('/windows4.jpg')" }}
    >
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to Our Site
            </h1>
            <p className="text-gray-600 mt-2">
              Join us today to experience amazing features!
            </p>
          </header>
          <section className="form-block h-fit transition-transform duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              {mode === "login" ? "Log In" : "Sign Up"}
            </h2>
            <div className="text-center mb-4">
              <span className="text-gray-600">
                {mode === "login" ? "Don't" : "Already"} have an account?
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={toggleMode}
                >
                  {"  "}Click here
                </span>
                <button
                  className="text-blue-500 ml-1 transition-transform duration-300 transform hover:scale-105"
                  onClick={toggleMode}
                >
                  &#8594;
                </button>
              </span>
            </div>
            <AuthenticationForm mode={mode} onSubmit={onSubmit} />
          </section>
        </div>
      </div>
      <div className="flex-1 hidden md:flex items-center justify-center p-8">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold">Explore Our Features</h2>
          <p className="mt-4">
            Discover how we can help you achieve your goals.
          </p>
        </div>
      </div>
    </div>
  );
}
