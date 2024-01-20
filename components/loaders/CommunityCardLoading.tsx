import { Skeleton } from "../ui/skeleton";

const CommunityCardLoading = () => {
  return (
    <article className="community-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Skeleton className="opacity-10 rounded-full size-12" />
        </div>

        <div className="space-y-2">
          <Skeleton className="opacity-60 w-20 h-3" />
          <Skeleton className="opacity-30 w-14 h-2" />
        </div>
      </div>

      <Skeleton className="opacity-70 mt-4 w-[80%] h-3" />
      <Skeleton className="opacity-30 mt-2 w-[40%] h-3" />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="opacity-40 w-[70px] h-9" />

        <div className="flex items-center">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={`community-card-members-loader-${index}`}
                className={`${
                  index !== 0 && "-ml-3"
                } opacity-10 rounded-full size-[28px]`}
              />
            ))}
        </div>
      </div>
    </article>
  );
};

export default CommunityCardLoading;
