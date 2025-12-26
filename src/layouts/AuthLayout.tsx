// src/layouts/AuthLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      backgroundImage: "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)",
      padding: "20px"
    }}>
        <Outlet />
    </div>
  );
};