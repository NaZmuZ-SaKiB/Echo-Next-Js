import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";

import AuthContextWrapper from "@/contexts/AuthContext";
import TopBar from "@/components/layout/TopBar";
import LeftSideBar from "@/components/layout/LeftSideBar";
import RightSideBar from "@/components/layout/RightSideBar";
import BottomBar from "@/components/layout/BottomBar";
import { currentUser } from "@/database/auth/auth.actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echo",
  description: "A place to share your thoughts",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <AuthContextWrapper>
      <html lang="en">
        <body className={inter.className}>
          <TopBar />
          <main className="flex">
            <LeftSideBar userId={user ? `${user._id}` : null} />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSideBar userId={user ? `${user._id}` : null} />
          </main>
          <BottomBar />
        </body>
      </html>
    </AuthContextWrapper>
  );
}
