import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";

import AuthContextWrapper from "@/contexts/AuthContext";
import TopBar from "@/components/layout/TopBar";
import LeftSideBar from "@/components/layout/LeftSideBar";
import RightSideBar from "@/components/layout/RightSideBar";
import BottomBar from "@/components/layout/BottomBar";
import { currentUser } from "@/database/auth/auth.actions";
import { getUsersCommunities } from "@/database/community/community.actions";
import { TCommunity } from "@/database/community/community.interface";
import { redirect } from "next/navigation";
import { getUnreadNotificationsCount } from "@/database/notification/notification.actions";

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

  let communities: TCommunity[] = [];

  if (user && user.onboarded) {
    communities = await getUsersCommunities(`${user?._id}`);
  } else {
    redirect("/onboarding");
  }

  const activityCount = await getUnreadNotificationsCount(`${user?._id}`);

  return (
    <AuthContextWrapper>
      <html lang="en">
        <body className={inter.className}>
          <TopBar
            JsonCommunities={JSON.stringify(communities)}
            JsonUser={JSON.stringify(user)}
          />
          <main className="flex">
            <LeftSideBar userId={`${user._id}`} activityCount={activityCount} />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSideBar userId={user ? `${user._id}` : null} />
          </main>
          <BottomBar activityCount={activityCount} />
        </body>
      </html>
    </AuthContextWrapper>
  );
}
