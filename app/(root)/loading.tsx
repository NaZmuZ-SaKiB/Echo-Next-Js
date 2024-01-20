import ThreadCardLoading from "@/components/loaders/ThreadCardLoading";

const loading = () => {
  return (
    <main>
      <h1 className="head-text">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <ThreadCardLoading
              key={`thread-card-loader-${i}`}
              isComment={false}
            />
          ))}
      </section>
    </main>
  );
};

export default loading;
