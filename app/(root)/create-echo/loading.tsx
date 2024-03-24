import { Skeleton } from "@/components/ui/skeleton";

const CreateThreadLoading = () => {
  return (
    <section>
      <h1 className="head-text">Create Echo</h1>
      <div className="mt-10  max-sm:mt-4 flex flex-col justify-start gap-10">
        <div className="flex flex-col gap-3 w-full">
          <Skeleton className="opacity-60 w-12 h-3" />
          <div>
            <Skeleton className="opacity-15 w-full h-96" />
          </div>
        </div>
        <Skeleton className="opacity-30 w-full h-9 flex justify-center items-center text-gray-400">
          Post Echo
        </Skeleton>
      </div>
    </section>
  );
};

export default CreateThreadLoading;
