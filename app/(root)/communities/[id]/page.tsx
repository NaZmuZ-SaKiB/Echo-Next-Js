import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs, publicCommunityTabs } from "@/constants";
import EchosTab from "@/components/shared/EchosTab";
import {
  fetchCommunityDetails,
  getCommunityThreadsCount,
  isUserInvitedToThisCommunity,
} from "@/database/community/community.actions";
import { currentUser } from "@/database/auth/auth.actions";
import CommunityRequestsTab from "@/components/shared/CommunityRequestsTab";
import CommunityMembersTab from "@/components/shared/CommunityMembersTab";
import CommunityProfileHeader from "@/components/shared/CommunityProfileHeader";

const SingleCommunityPage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);
  if (!communityDetails) return null;

  const isInvited = await isUserInvitedToThisCommunity(
    params.id,
    `${user._id}`
  );

  const communityThreadsCount = await getCommunityThreadsCount(
    `${communityDetails._id}`
  );

  const isCommunityMember = !!communityDetails?.members?.find(
    (member) => `${member._id}` === `${user._id}`
  );

  const isCommunityOwner =
    `${communityDetails.createdBy._id}` === `${user._id}`;

  return (
    <section>
      <CommunityProfileHeader
        communityId={`${communityDetails._id}`}
        authUserId={`${user._id}`}
        name={communityDetails.name!}
        username={communityDetails.username}
        imgUrl={communityDetails.image!}
        bio={communityDetails.bio || ""}
        communityOwner={isCommunityOwner}
        isCommunityMember={isCommunityMember}
        requestSent={communityDetails.requests.includes(`${user._id}`)}
        isInvited={isInvited}
      />

      <div className="mt-9 max-sm:mt-5">
        <Tabs defaultValue="echos" className="w-full">
          <TabsList className="tab">
            {(isCommunityOwner ? communityTabs : publicCommunityTabs).map(
              (tab: any) => (
                <TabsTrigger key={tab.label} value={tab.value} className="tab ">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    height={24}
                    width={24}
                  />
                  <p className="max-sm:hidden">{tab.label}</p>
                  {tab.label === "Echos" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                      {communityThreadsCount}
                    </p>
                  )}
                </TabsTrigger>
              )
            )}
          </TabsList>

          <TabsContent value="echos">
            <EchosTab
              currentUser_Id={`${user._id}`}
              fetchAccount_Id={`${communityDetails._id}`}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members">
            <CommunityMembersTab
              communityId={`${communityDetails._id}`}
              JSONmembers={JSON.stringify(communityDetails?.members)}
            />
          </TabsContent>

          {
            <TabsContent value="requests">
              <CommunityRequestsTab communityId={`${communityDetails._id}`} />
            </TabsContent>
          }
        </Tabs>
      </div>
    </section>
  );
};

export default SingleCommunityPage;
