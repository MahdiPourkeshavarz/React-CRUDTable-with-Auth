/* eslint-disable no-unused-vars */
import { useState } from "react";
import { AuthenticationForm } from "../components/AuthenticationForm";
import { API_URL } from "../constants";
import { httpRequest } from "../services/authServices";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [actionIsSuccessfull, setActionIsSuccessfull] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  async function onSubmit(data) {
    const url = mode === "login" ? API_URL.LOGIN_URL : API_URL.REGISTER_URL;
    const phone = data.number;
    const password = data.password;
    const createpassword = data.createpassword;
    try {
      let response = "";
      if (mode === "login") {
        response = await httpRequest.post(url, {
          phone,
          password,
        });
        const accessToken = await response.data.access;
        const refreshToken = await response.data.refresh;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        navigate("/home");
      } else {
        response = await httpRequest.post(url, {
          phone,
          password: createpassword,
        });
        toast.success("Account created! Now Login!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (e) {
      toast.error(`${e.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <>
      <ToastContainer />
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
    </>
  );
}
