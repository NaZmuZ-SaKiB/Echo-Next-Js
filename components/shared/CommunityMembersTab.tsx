import Image from "next/image";

import { TUser } from "@/database/user/user.interface";
import { Button } from "../ui/button";
import KickCommunityMember from "../forms/KickCommunityMember";

type TProps = {
  communityId: string;
  JSONmembers: string;
};

const CommunityMembersTab = ({ communityId, JSONmembers }: TProps) => {
  const members = JSON.parse(JSONmembers);

  return (
    <section className="mt-9  max-sm:mt-5 flex flex-col gap-10  max-sm:gap-4">
      {members.map((member: TUser) => (
        <article className="user-card">
          <div className="user-card_avatar">
            <div className="size-12 max-sm:size-10 relative">
              <Image
                src={member.image || "/assets/profile.svg"}
                alt="logo"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div className="flex-1 text-ellipsis">
              <h4 className="text-base-semibold text-light-1">{member.name}</h4>
              <p className="text-small-medium text-gray-1">
                @{member.username}
              </p>
            </div>
          </div>
          <Button className="user-card_btn">View</Button>
          <KickCommunityMember
            communityId={communityId}
            memberId={`${member._id}`}
          />
        </article>
      ))}
    </section>
  );
};

export default CommunityMembersTab;
