import UserCardLoading from "@/components/loaders/UserCardLoading";
import Searchbar from "@/components/shared/Searchbar";

const SearchPageLoading = () => {
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <UserCardLoading key={`user-card-loader-${i}`} />
          ))}
      </div>
    </section>
  );
};

export default SearchPageLoading;
