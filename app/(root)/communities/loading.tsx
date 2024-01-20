import CommunityCardLoading from "@/components/loaders/CommunityCardLoading";
import Searchbar from "@/components/shared/Searchbar";

const CommunitiesPageLoading = () => {
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="communities" />

      <div className="mt-14 flex flex-wrap justify-center gap-9">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <CommunityCardLoading key={`user-card-loader-${i}`} />
          ))}
      </div>
    </section>
  );
};

export default CommunitiesPageLoading;
