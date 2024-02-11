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

    const result = await fetchThreads(page, limit);
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
        const { _id, id, name, image } = thread.author;
        const comments = thread.replies.map((reply: any) => ({
          author: {
            image: reply.author.image,
          },
        }));
        console.log(thread);

        return (
          <ThreadCard
            key={thread._id.toString()}
            thread_Id={thread._id.toString()}
            currentUser_Id={user_Id || ""}
            parent_Id={null}
            content={thread.text}
            author={{ _id: _id.toString(), id, name, image } as TUser}
            community={
              thread.community
                ? ({
                    id: thread.community.id,
                    name: thread.community.name,
                    image: thread.community.image,
                  } as TCommunity)
                : (null as unknown as TCommunity)
            }
            createdAt={thread.createdAt!}
            comments={comments}
            likes={thread.likes}
          />
        );
      })}
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
