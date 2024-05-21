import Link from "next/link";
import Image from "next/image";

import CommunityRequestButton from "../forms/CommunityRequestButton";
import CommunityInvitationAcceptButton from "../forms/CommunityInvitationAcceptButton";
import { Button } from "../ui/button";

type TProps = {
  communityId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  communityOwner?: boolean;
  isCommunityMember: boolean;
  requestSent?: boolean;
  isInvited?: string | null;
};

const CommunityProfileHeader = ({
  communityId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  communityOwner,
  isCommunityMember,
  requestSent = false,
  isInvited = null,
}: TProps) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-20 object-cover">
            <Image
              src={imgUrl}
              alt="profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left max-sm:text-body-semibold text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium max-sm:text-small-semibold text-gray-1">
              @{username}
            </p>
          </div>
        </div>

        {/* Community Edit Button  */}
        {communityOwner && (
          <Link href={`/communities/edit/${communityId}`}>
            <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
              <Image src="/assets/edit.svg" alt="edit" width={25} height={25} />

              <p className="text-light-2 max-sm:hidden">Edit Community</p>
            </div>
          </Link>
        )}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      {/* Request to join community Button */}
      {!communityOwner && !isCommunityMember && !isInvited && (
        <div className="mt-4">
          <CommunityRequestButton
            requested={requestSent}
            communityId={communityId}
            userId={authUserId}
          />
        </div>
      )}

      {/* Invite to community Button  */}
      {communityOwner && (
        <Link href={`/communities/invite/${communityId}`} className="mt-3">
          <Button className="bg-primary-500 hover:bg-primary-500">
            Invite People
          </Button>
        </Link>
      )}

      {/* Leave Community Button  */}
      {isCommunityMember && (
        <div className="mt-4">
          <Button>Leave Community</Button>
        </div>
      )}

      {/* Invitation Accept Button  */}
      {isInvited && (
        <div className="mt-3">
          <CommunityInvitationAcceptButton notificationId={isInvited} />
        </div>
      )}

      <div className="mt-12 max-sm:mt-5 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default CommunityProfileHeader;
