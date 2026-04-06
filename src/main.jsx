import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import FundraiserPage from "./pages/FundraiserPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import NavBar from "./components/NavBar.jsx";
import ProfilePage from "./pages/ProfilePage";
import StartFundraiserPage from "./pages/StartFundraiserPage";
import CreatePledgePage from "./pages/CreatePledgePage";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminUserEditPage from "./pages/AdminUserEditPage.jsx";
import DeletedUsersPage from "./pages/DeletedUsersPage.jsx";
import DeletedFundraisersPage from "./pages/DeletedFundraisersPage.jsx";
import AdminFundraisersPage from "./pages/AdminFundraisersPage";
import AdminActivityLogsPage from "./pages/AdminActivityLogsPage";

const router = createBrowserRouter([
  {
      path: "/",
      element: <NavBar />,
      children: [
          { path: "/", element: <HomePage /> },
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <RegistrationForm /> },
          { path: "/fundraiser/:id", element: <FundraiserPage /> },
          { path: "/profile", element: <ProfilePage />},
          { path: "/create", element: <StartFundraiserPage />},
          { path: "/fundraiser/:id/pledge", element: <CreatePledgePage />},
          { path: "/admin/users", element: <AdminUsersPage /> },
          { path: "/admin/users/:id", element: <AdminUserEditPage /> },
          { path: "/admin/users/deleted", element: <DeletedUsersPage /> },
          { path: "/admin/fundraisers/deleted", element: <DeletedFundraisersPage />},
          { path: "/admin/fundraisers", element: <AdminFundraisersPage />},
          { path: "/activity-logs", element: <AdminActivityLogsPage /> },
      ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* Here we wrap our app in the router provider so they render */}
  </React.StrictMode>
);