import React from "react";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <div className="flex items-center justify-center min-h-screen bg-red-500">{children}</div>
    </React.Fragment>
  );
};

export default AuthLayout;
