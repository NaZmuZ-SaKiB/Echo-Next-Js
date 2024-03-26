import { searchCommunities } from "@/database/community/community.actions";
import { searchUsers } from "@/database/user/user.actions";

import UserCard from "../cards/UserCard";

type TProps = {
  userId: string | null;
};

const RightSideBar = async ({ userId }: TProps) => {
  const similarMinds = await searchUsers({
    userId: userId || "",
    searchString: "",
    pageNumber: 1,
    pageSize: 4,
    sortBy: "desc",
  });

  const suggestedCommunities = await searchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 4,
    sortBy: "desc",
  });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9">
          {suggestedCommunities.communities.length > 0 ? (
            <>
              {suggestedCommunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  id={community.id}
                  name={community.name || "Community"}
                  username={community.username}
                  imgUrl={community.image || ""}
                  personType="Community"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">
              No communities yet
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>

        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name || "User"}
                  username={person.username}
                  imgUrl={person.image || ""}
                  personType="User"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
