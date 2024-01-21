import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/database/user/user.actions";
import Searchbar from "@/components/shared/Searchbar";
import SearchResult from "@/components/shared/SearchResult";
import { Suspense } from "react";
import SearchResultLoading from "@/components/loaders/SearchResultLoading";

type TProps = {
  searchParams: { [key: string]: string | undefined };
};

const SearchPage = async ({ searchParams }: TProps) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const query = searchParams.q || "";
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="search" />

      <Suspense key={query} fallback={<SearchResultLoading type="User" />}>
        <SearchResult type="User" query={query} page={searchParams?.page} />
      </Suspense>
    </section>
  );
};

export default SearchPage;
