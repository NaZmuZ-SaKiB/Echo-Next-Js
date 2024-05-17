import Image from "next/image";
import Link from "next/link";
import CommunityRequestButton from "../forms/CommunityRequestButton";
import { Button } from "../ui/button";

type TProps = {
  profileUserId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: "Community" | "User";
  communityOwner?: boolean;
  isCommunityMember: boolean;
  requestSent?: boolean;
};

const ProfileHeader = ({
  profileUserId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
  communityOwner,
  isCommunityMember,
  requestSent = false,
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

        {profileUserId === authUserId && type !== "Community" && (
          <Link href="/profile/edit">
            <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
              <Image src="/assets/edit.svg" alt="edit" width={16} height={16} />

              <p className="text-light-2 max-sm:hidden">Edit Profile</p>
            </div>
          </Link>
        )}

        {/* Community Edit Button  */}
        {type === "Community" && communityOwner && (
          <Link href={`/communities/edit/${profileUserId}`}>
            <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
              <Image src="/assets/edit.svg" alt="edit" width={25} height={25} />

              <p className="text-light-2 max-sm:hidden">Edit Community</p>
            </div>
          </Link>
        )}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      {/* Request to join community  */}
      {type === "Community" && !communityOwner && !isCommunityMember && (
        <div className="mt-4">
          <CommunityRequestButton
            requested={requestSent}
            communityId={profileUserId}
            userId={authUserId}
          />
        </div>
      )}

      {/* Leave Community Button  */}
      {type === "Community" && isCommunityMember && (
        <div className="mt-4">
          <Button>Leave Community</Button>
        </div>
      )}

      <div className="mt-12 max-sm:mt-5 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
