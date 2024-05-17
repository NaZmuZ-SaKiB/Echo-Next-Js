import { fetchCommunityJoinRequests } from "@/database/community/community.actions";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import CommunityRequestAcceptButton from "../forms/CommunityRequestAcceptButton";

type TProps = {
  communityId: string;
};

const CommunityRequestsTab = async ({ communityId }: TProps) => {
  const requests = await fetchCommunityJoinRequests(communityId);
  console.log("requests", requests);

  return (
    <section className="mt-9  max-sm:mt-5 flex flex-col gap-10  max-sm:gap-4">
      {requests.map((request) => (
        <article className="user-card" key={`${request._id}`}>
          <div className="user-card_avatar">
            <div className="size-12 max-sm:size-10 relative">
              <Image
                src={request.userId.image || "/assets/profile.svg"}
                alt="logo"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div className="flex-1 text-ellipsis">
              <Link href={`/profile/${request.userId._id}`}>
                <h4 className="text-base-semibold text-light-1">
                  {request.userId.name}
                </h4>
              </Link>
              <p className="text-small-medium text-gray-1">
                @{request.userId.username}
              </p>
            </div>
          </div>
          <CommunityRequestAcceptButton requestId={`${request._id}`} />
        </article>
      ))}
    </section>
  );
};

export default CommunityRequestsTab;
