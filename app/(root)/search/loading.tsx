import SearchResultLoading from "@/components/loaders/SearchResultLoading";
import Searchbar from "@/components/shared/Searchbar";

const SearchPageLoading = () => {
  return (
    <section>
      <h1 className="head-text mb-10 max-sm:mb-4">Search</h1>

      <Searchbar routeType="search" />

      <SearchResultLoading type="User" />
    </section>
  );
};

export default SearchPageLoading;
