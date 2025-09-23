import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";


import { Router } from "./Router";
import "./index.css";
import { UserProvider } from "./hooks/useContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </UserProvider>
  </React.StrictMode>
);