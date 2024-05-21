"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import EchoCardLoading from "../loaders/EchoCardLoading";
import EchoCard from "../cards/EchoCard";
import ReplayCard from "../cards/ReplayCard";

type TProps = {
  limit: number;
  user_Id: string;
  fetchFunc: Function;
  args: any[];
  isReplayCard?: boolean;
};

const EchosInfiniteScroll = ({
  limit,
  user_Id,
  fetchFunc,
  args,
  isReplayCard,
}: TProps) => {
  const [page, setPage] = useState<number>(1);
  const [isNext, setIsNext] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { ref, inView } = useInView();

  const [threads, setThreads] = useState<any[]>([]);

  const fetchMore = () => {
    if (!isNext || isFetching) return;
    setPage((prev) => prev + 1);
  };

  const fetchNewThreads = async () => {
    if (page === 1) return;
    setIsFetching(true);

    const result = await fetchFunc(...args, page, limit);
    setThreads((prev) => [...prev, ...result.threads]);

    if (!result.isNext) {
      setIsNext(false);
    }

    setIsFetching(false);
  };

  useEffect(() => {
    fetchNewThreads();
  }, [page]);

  useEffect(() => {
    if (inView && isNext) {
      fetchMore();
    }
  }, [inView]);
  return (
    <>
      {threads.map((thread) => {
        return isReplayCard ? (
          <ReplayCard
            key={`thread-with-replies-${thread?._id}`}
            echo={{
              _id: thread?._id,
              author: thread?.author,
              text: thread?.text,
            }}
            reply={thread.replies}
            currentUser_Id={user_Id}
          />
        ) : (
          <EchoCard
            key={`${thread._id}`}
            currentUser_Id={user_Id}
            JSONEcho={JSON.stringify(thread)}
          />
        );
      })}
      {isNext ? (
        <div ref={ref}>
          <EchoCardLoading isComment={false} />
        </div>
      ) : (
        <p className="no-result">
          No more {isReplayCard ? "replies" : "echos"}.
        </p>
      )}
    </>
  );
};

export default EchosInfiniteScroll;
