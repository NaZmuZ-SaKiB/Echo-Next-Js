import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import Searchbar from "@/components/shared/Searchbar";
import SearchResult from "@/components/shared/SearchResult";
import SearchResultLoading from "@/components/loaders/SearchResultLoading";

type TProps = {
  searchParams: { [key: string]: string | undefined };
};

const CommunityPage = async ({ searchParams }: TProps) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const query = searchParams?.q || "";

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="communities" />

      <Suspense key={query} fallback={<SearchResultLoading type="Community" />}>
        <SearchResult
          type="Community"
          query={query}
          page={searchParams?.page}
        />
      </Suspense>
    </section>
  );
};

export default CommunityPage;
