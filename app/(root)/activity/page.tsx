import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getUserActivity } from "@/database/user/user.actions";
import Link from "next/link";
import Image from "next/image";

const ActivityPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // const activities = await getUserActivity(userInfo._id);
  const activities: any[] = [];
  return (
    <section>
      <h1 className="head-text mb-10  max-sm:mb-4">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activities?.length > 0 ? (
          activities.map((activity: any) => (
            <Link
              key={activity._id}
              href={`/thread/${activity.parentThread._id}`}
            >
              <article className="activity-card">
                <Image
                  src={activity.author.image}
                  alt="profile img"
                  height={20}
                  width={20}
                  className="rounded-full object-cove r"
                />
                <p className="!text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500">
                    {activity.author.name}
                  </span>{" "}
                  replied to your thread
                </p>
              </article>
            </Link>
          ))
        ) : (
          <p className="!text-base-regular text-light-3">No acivity yet</p>
        )}
      </section>
    </section>
  );
};

export default ActivityPage;
