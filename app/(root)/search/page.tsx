import { redirect } from "next/navigation";

import { fetchUser } from "@/database/user/user.actions";
import Searchbar from "@/components/shared/Searchbar";
import SearchResult from "@/components/shared/SearchResult";
import { Suspense } from "react";
import SearchResultLoading from "@/components/loaders/SearchResultLoading";
import { currentUser } from "@/database/auth/auth.actions";

type TProps = {
  searchParams: { [key: string]: string | undefined };
};

const SearchPage = async ({ searchParams }: TProps) => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  const query = searchParams.q || "";
  return (
    <section>
      <h1 className="head-text mb-10 max-sm:mb-4">Search</h1>

      <Searchbar routeType="search" />

      <Suspense key={query} fallback={<SearchResultLoading type="User" />}>
        <SearchResult type="User" query={query} page={searchParams?.page} />
      </Suspense>
    </section>
  );
};

export default SearchPage;
