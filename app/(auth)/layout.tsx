import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import "../globals.css";

export const metadata: Metadata = {
  title: "Echo",
  description: "A place to share your thoughts",
};

const inter = Inter({ subsets: ["latin"] });

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-1`}>
        <div className="w-full flex justify-center items-center h-screen">
          {children}
        </div>
      </body>
    </html>
  );
};

export default AuthLayout;
