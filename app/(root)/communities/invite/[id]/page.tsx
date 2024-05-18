import SearchResultLoading from "@/components/loaders/SearchResultLoading";
import CommunityInviteSearchResult from "@/components/shared/CommunityInviteSearchResult";
import Searchbar from "@/components/shared/Searchbar";
import { currentUser } from "@/database/auth/auth.actions";
import { getInvitedUsersList } from "@/database/community/community.actions";
import { Suspense } from "react";

type TProps = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

const CommunityInvitePage = async ({ params, searchParams }: TProps) => {
  const user = await currentUser();
  if (!user) return null;

  const invitedUsersList = await getInvitedUsersList(params.id);

  const query = searchParams.q || "";
  return (
    <section>
      <h1 className="head-text mb-10 max-sm:mb-4">Search</h1>

      <Searchbar routeType="search" />

      <Suspense key={query} fallback={<SearchResultLoading type="User" />}>
        <CommunityInviteSearchResult
          communityId={params.id}
          userId={`${user._id}`}
          query={query}
          page={searchParams?.page}
          invitedUsersList={invitedUsersList}
        />
      </Suspense>
    </section>
  );
};

export default CommunityInvitePage;
