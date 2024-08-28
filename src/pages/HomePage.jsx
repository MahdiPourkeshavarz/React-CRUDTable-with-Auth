import { useNavigate } from "react-router-dom";
import { TableProvider } from "../components/CourseTable";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    toast.success("You Have Successfully Loged in!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  });
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  }

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto mt-8 mb-8 px-4">
        <header className="flex flex-col">
          <h1 className="text-4xl font-bold mb-4">Online Courses</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 mb-6">
              Welcome to your dashboard. Here you can find a list of available
              online courses.
            </p>
            <button
              className="px-4 shadow-lg hover:shadow-xl hover:bg-blue-700 py-1 bg-blue-500 font-semibold text-xl text-white rounded-lg mb-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>
        <div className="my-4">
          <TableProvider />
        </div>
      </div>
    </>
  );
}
