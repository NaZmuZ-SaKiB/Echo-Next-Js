import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/database/user/user.actions";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Suspense } from "react";
import ThreadsTabLoading from "@/components/loaders/ThreadsTabLoading";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab: any) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab ">
                <Image src={tab.icon} alt={tab.label} height={24} width={24} />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab: any, index) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              <Suspense fallback={<ThreadsTabLoading />}>
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={index === 1 ? userInfo._id : userInfo.id}
                  accountType={index === 1 ? "Replies" : "User"}
                />
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
