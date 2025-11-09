import React from "react";
import AuthForm from "./_components/auth-form";
import Branding from "./_components/branding";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen grid-cols-1 place-items-center bg-cyan-100 p-4 lg:grid-cols-2">
      {/* Left Side - Branding */}
      <Branding />

      {/* Right Side - Auth Form */}
      <AuthForm>{children}</AuthForm>
    </div>
  );
};

export default Layout;
