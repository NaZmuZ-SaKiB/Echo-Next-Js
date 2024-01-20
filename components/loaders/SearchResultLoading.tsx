import CommunityCardLoading from "./CommunityCardLoading";
import UserCardLoading from "./UserCardLoading";

const SearchResultLoading = ({ type }: { type: "User" | "Community" }) => {
  return (
    <div
      className={`mt-14 flex gap-9 ${
        type === "User" ? "flex-col" : "flex-wrap justify-start"
      }`}
    >
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <>
            {type === "User" ? (
              <UserCardLoading key={`user-card-loader-${i}`} />
            ) : (
              <CommunityCardLoading key={`user-card-loader-${i}`} />
            )}
          </>
        ))}
    </div>
  );
};

export default SearchResultLoading;
