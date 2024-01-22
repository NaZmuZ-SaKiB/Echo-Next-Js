import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserCard from "../cards/UserCard";
import { fetchUser, searchUsers } from "@/database/user/user.actions";
import { searchCommunities } from "@/database/community/community.actions";
import CommunityCard from "../cards/CommunityCard";

type TProps = {
  type: "User" | "Community";
  query?: string | "";
  page?: string | undefined;
};

const SearchResult = async ({ type, query, page }: TProps) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  let result: any;
  if (type === "User") {
    result = await searchUsers({
      userId: user.id,
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
      className={`mt-14 flex gap-9 ${
        type === "User" ? "flex-col" : "flex-wrap justify-start"
      }`}
    >
      {type === "User" && result?.users?.length === 0 ? (
        <p className="no-result">No users</p>
      ) : (
        <>
          {result?.users?.map((person: any) => (
            <UserCard
              key={person.id}
              id={person.id}
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
              key={community.id}
              id={community.id}
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
