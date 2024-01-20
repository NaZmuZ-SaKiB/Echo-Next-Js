import { Skeleton } from "@/components/ui/skeleton";

const ActivityPageLoading = () => {
  const skeletonWidths = [80, 40, 70, 30, 80];
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {skeletonWidths.map((width) => (
          <article key={`activities-loader-${width}`} className="activity-card">
            <Skeleton className="opacity-30 rounded-full size-[20px]" />
            <Skeleton className={`opacity-30 w-[${width}%] h-3`} />
          </article>
        ))}
      </section>
    </section>
  );
};

export default ActivityPageLoading;
