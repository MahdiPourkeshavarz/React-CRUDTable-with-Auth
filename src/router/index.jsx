import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { HomePage } from "../pages/HomePage";
import { Layout } from "../layout/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
        errorElement: <HomePage />,
      },
    ],
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}
