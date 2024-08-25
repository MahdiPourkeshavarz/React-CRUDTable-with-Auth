import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { HomePage } from "../pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
    children: [
      {
        path: "/auth",
        element: <HomePage />,
      },
    ],
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}
