import { Suspense } from "react";
import { redirect } from "next/navigation";

import Searchbar from "@/components/shared/Searchbar";
import SearchResult from "@/components/shared/SearchResult";
import SearchResultLoading from "@/components/loaders/SearchResultLoading";
import { currentUser } from "@/database/auth/auth.actions";

type TProps = {
  searchParams: { [key: string]: string | undefined };
};

const CommunityPage = async ({ searchParams }: TProps) => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  const query = searchParams?.q || "";

  return (
    <section>
      <h1 className="head-text mb-10 max-sm:mb-4">Communities</h1>

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
