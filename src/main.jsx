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
          { path: "/create", element: <StartFundraiserPage />}
      ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* Here we wrap our app in the router provider so they render */}
  </React.StrictMode>
);