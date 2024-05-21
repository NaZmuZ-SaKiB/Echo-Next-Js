import { redirect } from "next/navigation";

import UserCard from "../cards/UserCard";
import CommunityCard from "../cards/CommunityCard";
import { currentUser } from "@/database/auth/auth.actions";
import { searchUsers } from "@/database/user/user.actions";
import { searchCommunities } from "@/database/community/community.actions";

type TProps = {
  type: "User" | "Community";
  query?: string | "";
  page?: string | undefined;
};

const SearchResult = async ({ type, query, page }: TProps) => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  let result: any;
  if (type === "User") {
    result = await searchUsers({
      userId: `${user._id}`,
      searchString: query || "",
      pageNumber: page ? +page : 1,
      pageSize: 25,
      sortBy: "desc",
    });
  } else {
    result = await searchCommunities({
      pageNumber: page ? +page : 1,
      pageSize: 20,
      searchString: query || "",
      sortBy: "desc",
    });
  }
  return (
    <div
      className={`mt-14 max-sm:mt-5 flex gap-9  max-sm:gap-4 ${
        type === "User" ? "flex-col" : "flex-wrap justify-start"
      }`}
    >
      {type === "User" && result?.users?.length === 0 ? (
        <p className="no-result">No users</p>
      ) : (
        <>
          {result?.users?.map((person: any) => (
            <UserCard
              key={`${person._id}`}
              id={`${person._id}`}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType="User"
            />
          ))}
        </>
      )}

      {type === "Community" && result?.communities?.length === 0 ? (
        <p className="no-result">No communities</p>
      ) : (
        <>
          {result?.communities?.map((community: any) => (
            <CommunityCard
              key={`${community._id}`}
              id={`${community._id}`}
              name={community.name}
              username={community.username}
              imgUrl={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default SearchResult;
