import Image from "next/image";
import { redirect } from "next/navigation";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, getUserThreadsCount } from "@/database/user/user.actions";
import EchosTab from "@/components/shared/EchosTab";
import { Suspense } from "react";
import EchosTabLoading from "@/components/loaders/EchosTabLoading";
import RepliesTab from "@/components/shared/RepliesTab";
import { currentUser } from "@/database/auth/auth.actions";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profileUserInfo = await fetchUser(params.id);
  if (!profileUserInfo) redirect("/");
  if (!profileUserInfo?.onboarded) redirect("/onboarding");

  const userThreadsCount = await getUserThreadsCount(`${profileUserInfo._id}`);

  return (
    <section>
      <ProfileHeader
        profileUserId={`${profileUserInfo._id}`}
        authUserId={`${user._id}`}
        name={profileUserInfo.name!}
        username={profileUserInfo.username}
        imgUrl={profileUserInfo.image!}
        bio={profileUserInfo.bio || ""}
      />

      <div className="mt-9 max-sm:mt-5">
        <Tabs defaultValue="echos" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab: any) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab ">
                <Image src={tab.icon} alt={tab.label} height={24} width={24} />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Echos" && (
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
            <Suspense fallback={<EchosTabLoading />}>
              <EchosTab
                currentUser_Id={`${user._id}`}
                fetchAccount_Id={`${profileUserInfo._id}`}
                accountType="User"
              />
            </Suspense>
          </TabsContent>

          <TabsContent
            value={profileTabs[1].value}
            className="w-full text-light-1"
          >
            <Suspense fallback={<EchosTabLoading />}>
              <RepliesTab
                currentUser_Id={`${user._id}`}
                user_id={`${profileUserInfo._id}`}
              />
            </Suspense>
          </TabsContent>

          <TabsContent
            value={profileTabs[2].value}
            className="w-full text-light-1"
          >
            <Suspense fallback={<EchosTabLoading />}>
              <EchosTab
                currentUser_Id={`${user._id}`}
                fetchAccount_Id={`${profileUserInfo._id}`}
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
