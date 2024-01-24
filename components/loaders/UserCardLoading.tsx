import { Skeleton } from "../ui/skeleton";

const UserCardLoading = () => {
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Skeleton className="opacity-10 rounded-full size-[48px] max-sm:size-10" />

        <div className="flex-1 text-ellipsis space-y-2">
          <Skeleton className="opacity-80 w-20 h-2 text-base-semibold text-light-1" />
          <Skeleton className="opacity-60 w-14 h-1.5 text-base-semibold text-light-1" />
        </div>
      </div>
      <Skeleton className="opacity-60 w-16 h-8" />
    </article>
  );
};

export default UserCardLoading;
