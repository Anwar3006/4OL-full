import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <section className="w-screen h-screen">{children}</section>;
};

export default AuthLayout;
