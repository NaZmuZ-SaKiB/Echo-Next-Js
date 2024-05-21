import { Suspense } from "react";
import { redirect } from "next/navigation";

import SearchResultLoading from "@/components/loaders/SearchResultLoading";
import CommunityInviteSearchResult from "@/components/shared/CommunityInviteSearchResult";
import Searchbar from "@/components/shared/Searchbar";
import { isUserLoggedIn } from "@/database/auth/auth.actions";
import { getInvitedUsersList } from "@/database/community/community.actions";

type TProps = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

const CommunityInvitePage = async ({ params, searchParams }: TProps) => {
  const user = await isUserLoggedIn();
  if (!user) redirect("/sign-in");

  const invitedUsersList = await getInvitedUsersList(params.id);

  const query = searchParams.q || "";
  return (
    <section>
      <h1 className="head-text mb-10 max-sm:mb-4">Search</h1>

      <Searchbar routeType="search" />

      <Suspense key={query} fallback={<SearchResultLoading type="User" />}>
        <CommunityInviteSearchResult
          communityId={params.id}
          userId={user.userId}
          query={query}
          page={searchParams?.page}
          invitedUsersList={invitedUsersList}
        />
      </Suspense>
    </section>
  );
};

export default CommunityInvitePage;
