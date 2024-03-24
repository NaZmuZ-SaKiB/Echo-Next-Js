import ThreadCardLoading from "@/components/loaders/ThreadCardLoading";
import { Skeleton } from "@/components/ui/skeleton";

const ThreadPageLoading = () => {
  return (
    <section className="relative">
      <div>
        <ThreadCardLoading isComment={false} />
      </div>

      <div className="mt-7">
        <div className="comment-form">
          <div className="flex items-center gap-3 w-full">
            <div>
              <Skeleton className="opacity-25 rounded-full size-[48px]" />
            </div>
          </div>

          <Skeleton className="opacity-25 w-28 h-10 rounded-3xl" />
        </div>
      </div>

      <div className="mt-10">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <ThreadCardLoading
              key={`thread-card-loader-${index}`}
              isComment={true}
            />
          ))}
      </div>
    </section>
  );
};

export default ThreadPageLoading;
