import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, getUserThreadsCount } from "@/database/user/user.actions";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Suspense } from "react";
import ThreadsTabLoading from "@/components/loaders/ThreadsTabLoading";
import RepliesTab from "@/components/shared/RepliesTab";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) redirect("/");

  const authUserInfo = await fetchUser(user.id);
  if (!authUserInfo) redirect("/");

  const profileUserInfo = await fetchUser(params.id);
  if (!profileUserInfo) redirect("/");
  if (!profileUserInfo?.onboarded) redirect("/onboarding");

  const userThreadsCount = await getUserThreadsCount(
    profileUserInfo._id.toString()
  );

  return (
    <section>
      <ProfileHeader
        profileUserId={profileUserInfo.id}
        authUserId={user.id}
        name={profileUserInfo.name!}
        username={profileUserInfo.username}
        imgUrl={profileUserInfo.image!}
        bio={profileUserInfo.bio || ""}
      />

      <div className="mt-9 max-sm:mt-5">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab: any) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab ">
                <Image src={tab.icon} alt={tab.label} height={24} width={24} />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                    {userThreadsCount}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value={profileTabs[0].value}
            className="w-full text-light-1"
          >
            <Suspense fallback={<ThreadsTabLoading />}>
              <ThreadsTab
                currentUser_Id={authUserInfo._id.toString()}
                fetchAccount_Id={profileUserInfo._id.toString()}
                accountType="User"
              />
            </Suspense>
          </TabsContent>

          <TabsContent
            value={profileTabs[1].value}
            className="w-full text-light-1"
          >
            <Suspense fallback={<ThreadsTabLoading />}>
              <RepliesTab
                currentUser_Id={authUserInfo._id.toString()}
                user_id={profileUserInfo._id.toString()}
              />
            </Suspense>
          </TabsContent>

          <TabsContent
            value={profileTabs[2].value}
            className="w-full text-light-1"
          >
            <Suspense fallback={<ThreadsTabLoading />}>
              <ThreadsTab
                currentUser_Id={authUserInfo._id.toString()}
                fetchAccount_Id={profileUserInfo._id.toString()}
                accountType="User"
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
