import Image from "next/image";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import ThreadsTab from "@/components/shared/ThreadsTab";
import {
  fetchCommunityDetails,
  getCommunityThreadsCount,
} from "@/database/community/community.actions";
import UserCard from "@/components/cards/UserCard";
import { fetchUser } from "@/database/user/user.actions";
import { currentUser } from "@/database/auth/auth.actions";

const SingleCommunityPage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);
  if (!communityDetails) return null;

  const communityThreadsCount = await getCommunityThreadsCount(
    `${communityDetails._id}`
  );

  return (
    <section>
      <ProfileHeader
        profileUserId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name!}
        username={communityDetails.username}
        imgUrl={communityDetails.image!}
        bio={communityDetails.bio || ""}
        type="Community"
      />

      <div className="mt-9 max-sm:mt-5">
        <Tabs defaultValue="echos" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab: any) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab ">
                <Image src={tab.icon} alt={tab.label} height={24} width={24} />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Echos" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                    {communityThreadsCount}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="echos">
            <ThreadsTab
              currentUser_Id={`${user._id}`}
              fetchAccount_Id={`${communityDetails._id}`}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails?.members?.map((member: any) => (
                <UserCard
                  key={`${member._id}`}
                  id={`${member._id}`}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests">
            <ThreadsTab
              currentUser_Id={`${user._id}`}
              fetchAccount_Id={`${communityDetails._id}`}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SingleCommunityPage;
