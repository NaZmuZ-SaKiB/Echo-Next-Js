import CommunityCardLoading from "@/components/loaders/CommunityCardLoading";
import SearchResultLoading from "@/components/loaders/SearchResultLoading";
import Searchbar from "@/components/shared/Searchbar";

const CommunitiesPageLoading = () => {
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="communities" />

      <SearchResultLoading type="Community" />
    </section>
  );
};

export default CommunitiesPageLoading;
