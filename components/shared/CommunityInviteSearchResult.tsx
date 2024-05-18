import { searchUsers } from "@/database/user/user.actions";
import Image from "next/image";
import { Button } from "../ui/button";
import CommunityInviteButton from "../forms/CommunityInviteButton";

type TProps = {
  communityId: string;
  userId: string;
  query?: string | "";
  page?: string | undefined;
  invitedUsersList: string[];
};

const CommunityInviteSearchResult = async ({
  communityId,
  userId,
  query,
  page,
  invitedUsersList,
}: TProps) => {
  const result = await searchUsers({
    userId: userId,
    searchString: query || "",
    pageNumber: page ? +page : 1,
    pageSize: 25,
    sortBy: "desc",
  });

  return (
    <div className={`mt-14 max-sm:mt-5 flex gap-9  max-sm:gap-4 flex-col`}>
      {result?.users?.length === 0 ? (
        <p className="no-result">No users</p>
      ) : (
        <>
          {result?.users?.map((person: any) => (
            <article className="user-card">
              <div className="user-card_avatar">
                <div className="size-12 max-sm:size-10 relative">
                  <Image
                    src={person?.image || "/assets/profile.svg"}
                    alt="logo"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 text-ellipsis">
                  <h4 className="text-base-semibold text-light-1">
                    {person.name}
                  </h4>
                  <p className="text-small-medium text-gray-1">
                    @{person.username}
                  </p>
                </div>
              </div>
              <CommunityInviteButton
                communityId={communityId}
                userId={`${person?._id}`}
                isInvited={invitedUsersList.includes(`${person?._id}`)}
              />
            </article>
          ))}
        </>
      )}
    </div>
  );
};

export default CommunityInviteSearchResult;
