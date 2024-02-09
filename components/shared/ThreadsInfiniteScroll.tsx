"use client";

import { fetchThreads } from "@/database/thread/thread.actions";
import { useEffect, useState } from "react";
import ThreadCard from "../cards/ThreadCard";
import { TUser } from "@/database/user/user.interface";
import { TCommunity } from "@/database/community/community.interface";
import ThreadCardLoading from "../loaders/ThreadCardLoading";
import { useInView } from "react-intersection-observer";

type TProps = {
  limit: number;
  user_Id: string;
};

const ThreadsInfiniteScroll = ({ limit, user_Id }: TProps) => {
  const [page, setPage] = useState<number>(1);
  const [isNext, setIsNext] = useState<boolean>(true);

  const { ref, inView } = useInView();

  const [threads, setThreads] = useState<any[]>([]);

  const fetchMore = () => {
    if (!isNext) return;
    setPage((prev) => prev + 1);
  };

  const fetchNewThreads = async () => {
    if (page === 1) return;

    const result = await fetchThreads(page, limit);
    setThreads((prev) => [...prev, ...result.threads]);

    if (!result.isNext) {
      setIsNext(false);
    }
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
      {threads.map((thread) => (
        <ThreadCard
          key={thread._id.toString()}
          thread_Id={thread._id.toString()}
          currentUser_Id={user_Id || ""}
          parent_Id={null}
          content={thread.text}
          author={thread.author as unknown as TUser}
          community={thread.community as unknown as TCommunity}
          createdAt={thread.createdAt!}
          comments={thread.replies}
          likes={thread.likes}
        />
      ))}
      {isNext ? (
        <div ref={ref}>
          <ThreadCardLoading isComment={false} />
        </div>
      ) : (
        <p className="no-result">No more threads.</p>
      )}
    </>
  );
};

export default ThreadsInfiniteScroll;
